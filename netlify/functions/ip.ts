import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import { HEADER_APPCHECK } from "../../src/lib/constants";
import { verifyAppCheck } from "../helpers";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers } = event;
  if (!headers[HEADER_APPCHECK]) {
    return {
      statusCode: 401,
      body: 'Unauthorized.'
    }
  }

  // const verified = await verifyAppCheck(headers[HEADER_APPCHECK] as string);
  // if (!verified) {
  //   return {
  //     statusCode: 401,
  //     body: 'Unauthorized.'
  //   }
  // }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ip: headers['client-ip']
    })
  }
};

export { handler };
