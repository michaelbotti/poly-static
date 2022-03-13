import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerCallback,
  HandlerResponse,
} from "@netlify/functions";
import {
  HandleResponseBody,
} from "../../src/lib/helpers/search";
import { normalizeNFTHandle } from "../../src/lib/helpers/nfts";
import {
  HEADER_HANDLE,
  HEADER_IS_SPO,
} from "../../src/lib/constants";
import { ensureHandleAvailable, getAccessTokenCookieName } from "../helpers/util";

// Main handler function for GET requests.
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
  callback: HandlerCallback
): Promise<HandlerResponse> => {
  const { headers } = event;

  const headerHandle = headers[HEADER_HANDLE];
  const isSPO = headers[HEADER_IS_SPO] === 'true';
  const headerAccess = headers[getAccessTokenCookieName(isSPO)];

  if (!headerAccess || !headerHandle) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        available: false,
        message: "Unauthorized. Missing request headers.",
      } as HandleResponseBody),
    };
  }

  try {
    const handle = normalizeNFTHandle(headerHandle);
    return ensureHandleAvailable(headerAccess, handle, isSPO);
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        available: false,
        error: true,
        message: 'Unexpected error.',
      }),
    };
  }
};

export { handler };
