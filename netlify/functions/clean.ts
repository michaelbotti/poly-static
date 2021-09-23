import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import "cross-fetch/polyfill";
import { HEADER_APPCHECK } from "../../src/lib/constants";
import { getFirebase, verifyAppCheck } from "../helpers/firebase";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers } = event;
  if (!headers[HEADER_APPCHECK]) {
    return {
      statusCode: 403,
      body: 'Unauthorized.'
    }
  }

  const verified = await verifyAppCheck(headers[HEADER_APPCHECK] as string);
  if (!verified) {
    return {
      statusCode: 403,
      body: 'Unauthorized.'
    }
  }

  const database = (await getFirebase()).database();
  const ref = database.ref('/activeSessions');
  await ref.transaction((currentValue) => {
    if (!currentValue) {
      return currentValue;
    }

    return currentValue.filter(({ timestamp }: { timestamp: number }) => Date.now() - timestamp < 600000);
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Done.'
    }),
  };
};

export { handler };
