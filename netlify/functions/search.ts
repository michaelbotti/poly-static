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
import { getActiveSessionsByHandle, getActiveSessionsByPhoneNumber, getMintedHandles, getPaidSessionByHandle, getReservedHandles, initFirebase } from "../helpers/firebase";
import { fetchNodeApp } from "../helpers/util";
import { decode } from "querystring";

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
  const mintedHandles = await getMintedHandles();

  const { phoneNumber } = decode(headerAccess);
  const activeSessionsByPhone = await getActiveSessionsByPhoneNumber(phoneNumber);
  if (activeSessionsByPhone.length > 3) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "Too many sessions open! Try again after one expires.",
        available: false,
      } as HandleResponseBody),
    };
  }

  const activeSessionsByHandle = await getActiveSessionsByHandle(handle);
  if (activeSessionsByHandle) {
    return {
      statusCode: 403,
      body: JSON.stringify(getDefaultActiveSessionUnvailable()),
    };
  }

  const paidSession = await getPaidSessionByHandle(handle);
  if (paidSession) {
    return {
      statusCode: 403,
      body: JSON.stringify(getDefaultActiveSessionUnvailable()),
    };
  }

  const { exists, policyID, assetName } = await fetchNodeApp("/exists", {
    headers: {
      [HEADER_HANDLE]: handle,
    },
  }).then((res) => res.json());

  if (exists) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        available: false,
        link: `https://${process.env.CARDANOSCAN_DOMAIN}/token/${policyID}.${assetName}`,
        message: "Handle already exists!",
        twitter: false,
      } as HandleResponseBody),
    };
  }

  const reservedHandles = await getReservedHandles();
  if (reservedHandles && reservedHandles?.manual?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getReservedUnavailable()),
    };
  }

  if (reservedHandles && reservedHandles?.spos?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getSPOUnavailable()),
    };
  }

  if (reservedHandles && reservedHandles?.twitter?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getTwitterResponseUnvailable()),
    };
  }

  if (
    (reservedHandles && reservedHandles?.blacklist?.includes(handle)) ||
    (mintedHandles && mintedHandles?.some(({ handleName }) => handleName === handle))
  ) {
    return {
      statusCode: 403,
      body: JSON.stringify(getDefaultResponseUnvailable()),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(getDefaultResponseAvailable()),
  };
};

export { handler };
