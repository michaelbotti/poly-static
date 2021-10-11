import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerCallback,
  HandlerResponse,
} from "@netlify/functions";
import { getFirebase, queryHandleOnchain, verifyAppCheck } from "../helpers";
import {
  getDefaultActiveSessionUnvailable,
  getDefaultResponseAvailable,
  HandleResponseBody,
} from "../../src/lib/helpers/search";
import "cross-fetch/polyfill";
import { normalizeNFTHandle } from "../../src/lib/helpers/nfts";
import {
  HEADER_APPCHECK,
  HEADER_HANDLE,
  HEADER_IP_ADDRESS
} from "../../src/lib/constants";
import {
  ActiveSessionType,
} from "../../src/context/mint";

// Main handler function for GET requests.
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
  callback: HandlerCallback
): Promise<HandlerResponse> => {
  const { headers } = event;

  const headerAppCheck = headers[HEADER_APPCHECK];
  const headerIp = headers[HEADER_IP_ADDRESS];
  const headerHandle = headers[HEADER_HANDLE];

  // Ensure an AppCheck credential.
  if (!headerAppCheck || !headerIp) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        available: false,
        message: "Unauthorized. No AppCheck or IP address found in request.",
      } as HandleResponseBody),
    };
  }

  if (!headerHandle) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        available: false,
        message: "Must provide a handle."
      } as HandleResponseBody)
    };
  }

  const validAPICall = await verifyAppCheck(headerAppCheck as string);
  if (!validAPICall) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        available: false,
        message: `Unauthorized. Invalid AppCheck token: ${headerAppCheck}`,
      } as HandleResponseBody),
    };
  }

  const handle = normalizeNFTHandle(headerHandle);
  const database = (await getFirebase()).database();
  const activeSessions = (await (
    await database
      .ref("/activeSessions")
      .once("value", (snapshot) => snapshot.val())
  ).val()) as ActiveSessionType[];

  if (activeSessions?.filter(({ ip }) => ip === headerIp).length >= 3) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "Too many sessions open. Try again later.",
        available: false,
      } as HandleResponseBody),
    };
  }

  if (
    activeSessions?.filter(
      ({ handle: sessionHandle }) => sessionHandle === handle
    ).length > 0
  ) {
    return {
      statusCode: 403,
      body: JSON.stringify(getDefaultActiveSessionUnvailable()),
    };
  }

  const { exists, policyId, assetName } = await queryHandleOnchain(handle);
  if (exists) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        available: false,
        link: `https://cardanoscan.io/token/${policyId}.${assetName}`,
        message: "Handle already exists!",
        twitter: false,
      } as HandleResponseBody),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(getDefaultResponseAvailable()),
  };
};

export { handler };
