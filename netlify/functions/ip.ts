import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import "cross-fetch/polyfill";
import { HEADER_APPCHECK } from "../../src/lib/constants";
import { verifyAppCheck } from "../helpers";

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

  // const data = await (
  //   await fetch(`https://api.ipdata.co?api-key=${process.env.IPDATA_API_KEY}`)
  // ).json();

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     ip: data?.ip,
  //   }),
  // };
  return {
    statusCode: 200,
    body: JSON.stringify({
      ip: headers['client-ip']
    })
  }
};

export { handler };
