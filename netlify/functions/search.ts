import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerCallback,
  HandlerResponse,
} from "@netlify/functions";
import {
  getDefaultActiveSessionUnvailable,
  getDefaultResponseAvailable,
  getDefaultResponseUnvailable,
  getPaidSessionUnavailable,
  getReservedUnavailable,
  getSPOUnavailable,
  getTwitterResponseUnvailable,
  HandleResponseBody,
} from "../../src/lib/helpers/search";
import { normalizeNFTHandle } from "../../src/lib/helpers/nfts";
import {
  HEADER_HANDLE,
  HEADER_JWT_ACCESS_TOKEN,
} from "../../src/lib/constants";
import { getActiveSessionByHandle, getActiveSessionsByEmail, getMintedHandles, getPaidSessionByHandle, getReservedHandles, initFirebase } from "../helpers/firebase";
import { ensureHandleAvailable, fetchNodeApp } from "../helpers/util";
import { AccessTokenPayload, decodeAccessToken } from "../helpers/jwt";

// Main handler function for GET requests.
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
  callback: HandlerCallback
): Promise<HandlerResponse> => {
  const { headers } = event;

  const headerHandle = headers[HEADER_HANDLE];
  const headerAccess = headers[HEADER_JWT_ACCESS_TOKEN];

  if (!headerAccess || !headerHandle) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        available: false,
        message: "Unauthorized. Missing request headers.",
      } as HandleResponseBody),
    };
  }

  await initFirebase();

  const handle = normalizeNFTHandle(headerHandle);

  const { emailAddress } = decodeAccessToken(headerAccess) as AccessTokenPayload;
  const activeSessionsByEmail = await getActiveSessionsByEmail(emailAddress);
  if (activeSessionsByEmail.length > 3) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "Too many sessions open! Try again after one expires.",
        available: false,
      } as HandleResponseBody),
    };
  }

  return ensureHandleAvailable(handle);
};

export { handler };
