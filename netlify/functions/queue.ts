import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import { fetch } from 'cross-fetch';

import { HEADER_APPCHECK, HEADER_PHONE } from "../../src/lib/constants";
import { verifyAppCheck } from "../helpers";


interface AppendAccessResponse {
  updated: boolean;
  alreadyExists: boolean;
  position: number;
  chainLoad: number | null;
}

export interface QueueResponseBody extends AppendAccessResponse {
  error: boolean;
  message?: string;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers } = event;
  if (!headers[HEADER_APPCHECK]) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: true,
        message: 'Unauthorized. An AppCheck token was not provided.'
      } as QueueResponseBody)
    }
  }

  if (!headers[HEADER_PHONE]) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Missing phone number.'
      } as QueueResponseBody)
    }
  }

  // const verified = await verifyAppCheck(headers[HEADER_APPCHECK] as string);
  // if (!verified) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({
  //       error: true,
  //       message: `Unauthorized. Invalid AppCheck token: ${headers[HEADER_APPCHECK]}.`
  //     } as QueueResponseBody)
  //   }
  // }

  try {
    const data: QueueResponseBody = await (await fetch(`${process.env.NODEJS_APP_URL}/queue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.NODE_AUTH_TOKEN_MAINNET}`,
        [HEADER_APPCHECK]: headers[HEADER_APPCHECK],
        [HEADER_PHONE]: headers[HEADER_PHONE]
      }
    })).json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: e.toString()
      } as QueueResponseBody)
    };
  }
};

export { handler };
