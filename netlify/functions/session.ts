import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse
} from "@netlify/functions";
import { fetch } from 'cross-fetch';
import jwt, { decode, JwtPayload } from "jsonwebtoken";

import {
  HEADER_HANDLE,
  HEADER_RECAPTCHA,
  HEADER_TWITTER_ACCESS_TOKEN,
  MAX_SESSION_LENGTH,
  HEADER_JWT_ACCESS_TOKEN,
  HEADER_JWT_SESSION_TOKEN
} from "../../src/lib/constants";
import {
  ActiveSessionType,
  ReservedHandlesType,
} from "../../src/context/mint";
import { fetchNodeApp } from '../helpers/util';
import { getRarityCost, isValid, normalizeNFTHandle } from "../../src/lib/helpers/nfts";
import { getSecret } from "../helpers";
import { verifyTwitterUser } from "../helpers";
import { getActiveSessionUnavailable, HandleResponseBody } from "../../src/lib/helpers/search";
import { getActiveSessions, getReservedHandles, initFirebase } from "../helpers/firebase";

export interface NodeSessionResponseBody {
  error: boolean,
  message?: string;
  address?: string;
}

export interface SessionResponseBody {
  error: boolean,
  message?: string;
  address: string;
  token: string;
  data: JwtPayload
}

const unauthorizedResponse: HandlerResponse = {
  statusCode: 401,
  body: JSON.stringify({
    error: true,
    message: "Unauthorized.",
  } as SessionResponseBody),
};

interface AccessTokenPayload extends JwtPayload {
  phoneNumber: string;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers } = event;

  const headerHandle = headers[HEADER_HANDLE];
  const headerRecaptcha = headers[HEADER_RECAPTCHA];
  const headerTwitter = headers[HEADER_TWITTER_ACCESS_TOKEN];
  const accessToken = headers[HEADER_JWT_ACCESS_TOKEN];

  // Normalize and validate handle.
  const handle = headerHandle && normalizeNFTHandle(headerHandle);
  const validHandle = handle && isValid(handle);

  if (!headerRecaptcha || !accessToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: true,
        message: "Unauthorized.",
      } as SessionResponseBody),
    };
  }

  if (!handle || !validHandle) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Invalid handle format.'
      } as SessionResponseBody)
    }
  }

  await initFirebase();

  // Anti-bot.
  const reCaptchaValidated = await passesRecaptcha(headerRecaptcha);
  if (!reCaptchaValidated) {
    return unauthorizedResponse;
  }

  // Verified Twitter user if needed.
  if (headerTwitter) {
    const exp = headerTwitter && (await verifyTwitterUser(headerTwitter));
    if (!exp || exp > Date.now()) {
      return unauthorizedResponse;
    }
  }

  const reservedhandles = await getReservedHandles();
  const activeSessions = await getActiveSessions();

  const { phoneNumber } = decode(accessToken) as AccessTokenPayload;
  const tooManySessions = activeSessions && activeSessions?.filter(
    ({ phoneNumber: existingPhoneNumber }) => existingPhoneNumber === phoneNumber
  ).length > 3;

  if (tooManySessions) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: true,
        message: 'Sorry, too many open sessions!'
      } as SessionResponseBody)
    }
  }

  const handleBeingPurchased = activeSessions && activeSessions?.filter(({ handle }) =>
    handle === headerHandle
  ).length > 0;

  if (handleBeingPurchased) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: true,
        message: 'Sorry, this handle is being purchased! Try again later.'
      } as SessionResponseBody)
    }
  }

  if (reservedhandles) {
    const { manual, spos, blacklist } = reservedhandles;
    if (blacklist?.includes(handle)) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: true,
          message: 'Sorry, that handle is not allowed.'
        } as SessionResponseBody)
      };
    }

    if (
      manual?.includes(handle) ||
      spos?.includes(handle)
    ) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: true,
          message: 'This handle is reserved. Contact private@adahandle.com to claim.'
        } as SessionResponseBody)
      };
    }
  }

  // // Ping pending sessions.
  // let pendingSessionCutLine = false;
  // await database
  //   .ref("/pendingSessions")
  //     .transaction((snapshot: string[] | null) => {
  //       if (!snapshot) {
  //         return [handle];
  //       }

  //       if (snapshot.includes(handle)) {
  //         pendingSessionCutLine = true;
  //         return snapshot;
  //       }

  //       return [
  //         ...snapshot,
  //         handle
  //       ];
  //   });

  // if (pendingSessionCutLine) {
  //   return {
  //     statusCode: 403,
  //     body: JSON.stringify(getActiveSessionUnavailable())
  //   }
  // }


  /**
   * We sign a session JWT tokent to authorize the purchase,
   * and include the access phone number to limit request.
   */
  const sessionSecret = await getSecret('session');
  const sessionToken = jwt.sign(
    {
      iat: Date.now(),
      handle,
      cost: getRarityCost(handle),
      phoneNumber
    },
    sessionSecret,
    {
      expiresIn: (MAX_SESSION_LENGTH * 1000).toString() // 10 minutes
    }
  );

  // Get payment details from server.
  const res: NodeSessionResponseBody = await fetchNodeApp('/session', {
    headers: {
      [HEADER_JWT_ACCESS_TOKEN]: accessToken,
      [HEADER_JWT_SESSION_TOKEN]: sessionToken,
    }
  }).then(res => res.json());

  const mutatedRes: SessionResponseBody = {
    error: res.error,
    message: res?.message || '',
    address: res?.address || '',
    token: sessionToken,
    data: decode(sessionToken) as JwtPayload,
  }

  if (res.error) {
    return {
      statusCode: 500,
      body: JSON.stringify(mutatedRes),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(mutatedRes),
  }
};

/**
 * Verifies against ReCaptcha.
 * @param token
 * @param ip
 * @returns
 */
 const passesRecaptcha = async (
  token: string
): Promise<boolean | HandlerResponse> => {
  const recaptcha_url = new URL(
    "https://www.google.com/recaptcha/api/siteverify"
  );
  recaptcha_url.searchParams.set("secret", process.env.RECAPTCHA_SECRET || "");
  recaptcha_url.searchParams.set("response", token);

  const { success, score, action } = (await (
    await fetch(recaptcha_url.toString(), {
      method: "POST",
    })
  ).json()) as { success: boolean; score: Number; action: string };

  if (!success || score < 0.8 || action !== "submit") {
    return {
      statusCode: 422,
      body: JSON.stringify({
        message:
          "Hmm, we think you might be a bot but we hope we're wrong. Please try again.",
      } as HandleResponseBody),
    };
  }

  return true;
};

export { handler };
