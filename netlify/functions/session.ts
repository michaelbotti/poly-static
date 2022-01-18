import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse
} from "@netlify/functions";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { fetch } from 'cross-fetch';

import {
  HEADER_HANDLE,
  HEADER_RECAPTCHA,
  HEADER_TWITTER_ACCESS_TOKEN,
  MAX_SESSION_LENGTH,
  HEADER_JWT_ACCESS_TOKEN,
  HEADER_JWT_SESSION_TOKEN,
  HEADER_IS_SPO,
  MAX_SESSION_LENGTH_SPO
} from "../../src/lib/constants";
import { ensureHandleAvailable, fetchNodeApp } from '../helpers/util';
import { getRarityCost, isValid, normalizeNFTHandle } from "../../src/lib/helpers/nfts";
import { getSecret } from "../helpers";
import { verifyTwitterUser } from "../helpers";
import { getActiveSessionsByEmail, getActiveSessionByHandle, getReservedHandles, initFirebase } from "../helpers/firebase";
import { responseWithMessage, unauthorizedResponse } from "../helpers/response";
import { AccessTokenPayload } from "../helpers/jwt";
import { HandleResponseBody } from "../../src/lib/helpers/search";

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
  const headerIsSpo = headers[HEADER_IS_SPO] === 'true' ? true : false;
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

  await initFirebase();

  // Ensure no one is trying to force an existing Handle.
  const { body } = await ensureHandleAvailable(handle, headerIsSpo);
  const data: HandleResponseBody = JSON.parse(body);

  if (!data.available && !data.twitter) {
    return unauthorizedResponse;
  }

  // Verified Twitter user if needed.
  if (data.available && data.twitter && headerTwitter) {
    const exp = headerTwitter && (await verifyTwitterUser(headerTwitter));
    if (!exp || exp > Date.now()) {
      return unauthorizedResponse;
    }
  }

  const { emailAddress } = decode(accessToken) as AccessTokenPayload;
  if (!headerIsSpo) {
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

    // If the incoming session is an SPO, we don't want to fail for reserved SPOs
    const isManualOrSpo = !headerIsSpo ? (manual?.includes(handle) || spos?.includes(handle)) : manual?.includes(handle);
    if (isManualOrSpo) {
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
      emailAddress: headerIsSpo ? 'spos@adahandle.com' : emailAddress,
      isSPO: headerIsSpo
    },
    sessionSecret,
    {
      expiresIn: (headerIsSpo ? MAX_SESSION_LENGTH_SPO : MAX_SESSION_LENGTH * 1000).toString() // 10 minutes
    }
  );

  // Get payment details from server.
  const res: NodeSessionResponseBody = await fetchNodeApp('session', {
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
