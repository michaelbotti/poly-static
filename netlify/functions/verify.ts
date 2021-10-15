import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import { JwtPayload } from 'jsonwebtoken';

import { HEADER_APPCHECK, HEADER_PHONE, HEADER_PHONE_AUTH } from "../../src/lib/constants";
import { verifyAppCheck } from "../helpers";
import { fetchNodeApp } from "../helpers/util";

export interface VerifyResponseBody {
  error: boolean;
  token?: string;
  data?: JwtPayload;
  verified?: boolean;
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
      body: 'Unauthorized.'
    }
  }

  if (!headers[HEADER_PHONE]) {
    console.log(headers[HEADER_PHONE])
    return {
      statusCode: 400,
      body: 'Missing phone number.'
    }
  }

  if (!headers[HEADER_PHONE_AUTH]) {
    return {
      statusCode: 400,
      body: 'Missing auth code.'
    }
  }

  // const verified = await verifyAppCheck(headers[HEADER_APPCHECK] as string);
  // if (!verified) {
  //   return {
  //     statusCode: 401,
  //     body: 'Unauthorized.'
  //   }
  // }

  try {
    const data = await fetchNodeApp(`/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${process.env.NODE_AUTH_TOKEN_MAINNET}`,
        [HEADER_PHONE]: headers[HEADER_PHONE],
        [HEADER_PHONE_AUTH]: headers[HEADER_PHONE_AUTH]
      }
    }).then(res => res.json());

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
};

export { handler };
