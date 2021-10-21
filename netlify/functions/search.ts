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
  HEADER_JWT_ACCESS_TOKEN
} from "../../src/lib/constants";
import { ReservedHandlesType } from "../../src/context/mint";
import { initFirebase } from "../helpers/firebase";
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

  const firebase = await initFirebase();

  const handle = normalizeNFTHandle(headerHandle);
  const activeSessions = await firebase.database()
      .ref("/activeSessions")
      .get()
      .then(s => s.val())

  const { phoneNumber } = decode(headerAccess);
  // if (activeSessions?.filter(session => session.phoneNumber === phoneNumber).length >= 3) {
  //   return {
  //     statusCode: 403,
  //     body: JSON.stringify({
  //       message: "Too many sessions open! Try again after one expires.",
  //       available: false,
  //     } as HandleResponseBody),
  //   };
  // }

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

  const paidSessions = await firebase.database()
      .ref("/paidSessions")
      .get()
      .then(s => s.val())

  if (
    paidSessions?.find(s => s.handle === handle)
  ) {
    return {
      statusCode: 403,
      body: JSON.stringify(getDefaultActiveSessionUnvailable()),
    }
  }

  const { exists, policyID, assetName } = await fetchNodeApp('/exists', {
    headers: {
      [HEADER_HANDLE]: handle
    }
  }).then(res => res.json());

  if (exists) {
    const domain = process.env.NODE_ENV === 'development' ? 'testnet.cardanoscan.io' : 'cardanoscan.io';
    return {
      statusCode: 200,
      body: JSON.stringify({
        available: false,
        link: `https://${domain}/token/${policyID}.${assetName}`,
        message: "Handle already exists!",
        twitter: false,
      } as HandleResponseBody),
    };
  }

  const reservedHandles = (await (
    await firebase.database()
      .ref("/reservedHandles")
      .once("value", (snapshot) => snapshot.val())
  ).val()) as ReservedHandlesType;

  if (reservedHandles?.manual?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getReservedUnavailable()),
    }
  }

  if (reservedHandles?.spos?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getSPOUnavailable()),
    }
  }

  if (reservedHandles?.twitter?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getTwitterResponseUnvailable()),
    }
  }

  if (reservedHandles?.blacklist?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getDefaultResponseUnvailable()),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(getDefaultResponseAvailable()),
  };
};

export { handler };
