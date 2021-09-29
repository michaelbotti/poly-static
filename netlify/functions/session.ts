import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse
} from "@netlify/functions";
import jwt, { decode } from "jsonwebtoken";
import "cross-fetch/polyfill";

import {
  HEADER_APPCHECK,
  HEADER_HANDLE,
  HEADER_RECAPTCHA,
  HEADER_TWITTER_ACCESS_TOKEN,
  HEADER_IP_ADDRESS,
  HEADER_AUTH_TOKEN,
} from "../../src/lib/constants";
import {
  ActiveSessionType,
  ReservedHandlesType,
} from "../../src/context/mint";
import { isValid, normalizeNFTHandle } from "../../src/lib/helpers/nfts";
import { getFirebase, verifyAppCheck, getSecret } from "../helpers";
import { verifyTwitterUser } from "../helpers";
import { HandleResponseBody } from "../../src/lib/helpers/search";

export interface SessionResponseBody {
  message: string;
  token: string;
  address: string;
  data: jwt.JwtPayload;
}

const unauthorizedResponse: HandlerResponse = {
  statusCode: 403,
  body: JSON.stringify({
    message: "Unauthorized.",
  } as SessionResponseBody),
};

/**
 * Verifies against ReCaptcha.
 * @param token
 * @param ip
 * @returns
 */
const passesRecaptcha = async (
  token: string,
  ip?: string | null
): Promise<boolean | HandlerResponse> => {
  const recaptcha_url = new URL(
    "https://www.google.com/recaptcha/api/siteverify"
  );
  recaptcha_url.searchParams.set("secret", process.env.RECAPTCHA_SECRET || "");
  recaptcha_url.searchParams.set("response", token);
  ip && recaptcha_url.searchParams.set("remoteip", ip);

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

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers } = event;

  const headerHandle = headers[HEADER_HANDLE];
  const headerAppCheck = headers[HEADER_APPCHECK];
  const headerRecaptcha = headers[HEADER_RECAPTCHA];
  const headerTwitter = headers[HEADER_TWITTER_ACCESS_TOKEN];
  const headerIp = headers[HEADER_IP_ADDRESS];

  // Normalize and validate handle.
  const handle = headerHandle && normalizeNFTHandle(headerHandle);
  const validHandle = handle && isValid(handle);

  if (!headerAppCheck || !headerRecaptcha || !headerIp) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "Unauthorized.",
      } as SessionResponseBody),
    };
  }

  if (!handle || !validHandle) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid handle format.'
      } as SessionResponseBody)
    }
  }

  // Anti-bot.
  const reCaptchaValidated = await passesRecaptcha(headerRecaptcha, headerIp);
  if (!reCaptchaValidated) {
    console.log("failed recaptcha");
    return unauthorizedResponse;
  }

  // Verified App.
  const appCheckValidated = await verifyAppCheck(headerAppCheck);
  if (!appCheckValidated) {
    console.log("failed app check");
    return unauthorizedResponse;
  }

  // Verified Twitter user.
  if (headerTwitter) {
    const exp = headerTwitter && (await verifyTwitterUser(headerTwitter));
    if (!exp || exp > Date.now()) {
      console.log("failed twitter check");
      return unauthorizedResponse;
    }
  }

  // Get session data.
  const database = (await getFirebase()).database();
  const reservedhandles = (await (
    await database
      .ref("/reservedHandles")
      .once("value", (snapshot) => snapshot.val())
  ).val()) as ReservedHandlesType;
  const activeSessions = (await (
    await database
      .ref("/activeSessions")
      .once("value", (snapshot) => snapshot.val())
  ).val()) as ActiveSessionType[];
  const ipSessionCount = activeSessions?.filter(
    ({ ip }) => ip === headerIp
  ).length;

  const { manual, spos } = reservedhandles;
  if (
    manual.includes(handle) ||
    spos.includes(handle) ||
    activeSessions?.filter(({ handle }) => handle === headerHandle).length >
      0 ||
    ipSessionCount >= 3
  ) {
    console.log("failed reserved or spo");
    return unauthorizedResponse;
  }

  const secret = await getSecret();

  // Save interanl session.
  const sessionStart = Date.now();
  await database.ref("/activeSessions").transaction((currentValue) => {
    if (!currentValue) {
      return [
        {
          ip: headerIp,
          handle,
          timestamp: sessionStart,
        },
      ];
    }

    return [
      ...currentValue,
      {
        ip: headerIp,
        handle,
        timestamp: sessionStart,
      },
    ];
  });

  // Sign token.
  const offsetSeconds = Math.floor((Date.now() - sessionStart) / 1000);
  const expiresIn = Math.floor(600 - offsetSeconds); // 10 minutes from session start.
  const token = jwt.sign(
    { handle },
    secret as jwt.Secret,
    { expiresIn }
    );

  // Get new payment address.
  const { address } = await fetch(`${process.env.URL}/.netlify/functions/wallet-address`, {
    headers: {
      [HEADER_AUTH_TOKEN]: token
    }
  }).then(res => res.json());

  return {
    statusCode: 200,
    headers: {

    },
    body: JSON.stringify({
      message: "Success! Session initiated.",
      token,
      address,
      data: decode(token, { complete: true } )
    } as SessionResponseBody),
  };
};

export { handler };
