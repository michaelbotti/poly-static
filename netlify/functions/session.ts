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
import { fetchNodeApp } from '../helpers/util';
import { getRarityCost, isValid, normalizeNFTHandle } from "../../src/lib/helpers/nfts";
import { getSecret } from "../helpers";
import { verifyTwitterUser } from "../helpers";
import { getActiveSessionsByEmail, getActiveSessionByHandle, getReservedHandles, initFirebase } from "../helpers/firebase";
import { botResponse, responseWithMessage, unauthorizedResponse } from "../helpers/response";
import { passesRecaptcha } from "../helpers/recaptcha";
import { AccessTokenPayload } from "../helpers/jwt";

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
    return unauthorizedResponse;
  }

  if (!handle || !validHandle) {
    return responseWithMessage(400, 'Invalid handle format.', true);
  }

  // Anti-bot.
  const reCaptchaValidated = await passesRecaptcha(headerRecaptcha);
  if (!reCaptchaValidated) {
    return botResponse;
  }

  await initFirebase();

  // Verified Twitter user if needed.
  if (headerTwitter) {
    const exp = headerTwitter && (await verifyTwitterUser(headerTwitter));
    if (!exp || exp > Date.now()) {
      return unauthorizedResponse;
    }
  }

  const { emailAddress } = decode(accessToken) as AccessTokenPayload;
  const activeSessionsByPhone = await getActiveSessionsByEmail(emailAddress);
  const tooManySessions = activeSessionsByPhone.length > 3;

  if (tooManySessions) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: true,
        message: 'Sorry, too many open sessions!'
      } as SessionResponseBody)
    }
  }

  const activeSessionsByHandle = await getActiveSessionByHandle(handle);
  if (activeSessionsByHandle) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: true,
        message: 'Sorry, this handle is being purchased! Try again later.'
      } as SessionResponseBody)
    }
  }

  const reservedHandles = await getReservedHandles();
  if (reservedHandles) {
    const { manual, spos, blacklist } = reservedHandles;
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

  /**
   * We sign a session JWT tokent to authorize the purchase,
   * and include the access email address to limit request.
   */
  const sessionSecret = await getSecret('session');
  const sessionToken = jwt.sign(
    {
      iat: Date.now(),
      handle,
      cost: getRarityCost(handle),
      emailAddress
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

export { handler };
