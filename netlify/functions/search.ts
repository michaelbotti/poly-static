import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerCallback,
  HandlerResponse,
} from "@netlify/functions";
import { getFirebase, queryHandleOnchain, verifyAppCheck } from "../helpers";
import {
  getBetaPhaseResponseUnavailable,
  getDefaultResponseAvailable,
  getDefaultResponseUnvailable,
  getTwitterResponseUnvailable,
  HandleResponseBody,
} from "../../src/lib/helpers/search";
import "cross-fetch/polyfill";
import { normalizeNFTHandle } from "../../src/lib/helpers/nfts";
import {
  BETA_PHASE_MATCH,
  HEADER_APPCHECK,
  HEADER_HANDLE,
  HEADER_IP_ADDRESS
} from "../../src/lib/constants";
import {
  ActiveSessionType,
  ReservedHandlesType,
} from "../../src/context/mint";

// Main handler function for GET requests.
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
  callback: HandlerCallback
): Promise<HandlerResponse> => {
  const { headers, httpMethod } = event;

  const headerAppCheck = headers[HEADER_APPCHECK];
  const headerHandle = headers[HEADER_HANDLE];
  const headerIp = headers[HEADER_IP_ADDRESS];

  // Ensure an AppCheck credential.
  if (!headerAppCheck || !headerIp || "GET" !== httpMethod) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        available: false,
        message: "Unauthorized.",
      } as HandleResponseBody),
    };
  }

  console.log("valid appcheck header");

  // Ensure a handle.
  if (!headerHandle) {
    return {
      statusCode: 400,
      body: "Must provide a handle.",
    };
  }

  console.log("valid handle header");

  const validAPICall = await verifyAppCheck(headerAppCheck as string);
  if (!validAPICall) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        available: false,
        message: "Unauthorized.",
      } as HandleResponseBody),
    };
  }

  console.log("valid API call");

  const handle = normalizeNFTHandle(headerHandle);

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

  console.log("not on-chain");

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
      body: JSON.stringify(getDefaultResponseUnvailable()),
    };
  }

  if (!handle.match(BETA_PHASE_MATCH)) {
    if (reservedhandles?.twitter?.includes(handle)) {
      return {
        statusCode: 403,
        body: JSON.stringify(getTwitterResponseUnvailable()),
      };
    }

    return {
      statusCode: 403,
      body: JSON.stringify(getBetaPhaseResponseUnavailable()),
    };
  }

  console.log("valid beta phase handle");

  console.log("not on chain");

  return {
    statusCode: 200,
    body: JSON.stringify(getDefaultResponseAvailable()),
  };
};

export { handler };
