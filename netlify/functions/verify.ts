import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import { JwtPayload } from 'jsonwebtoken';

import { HEADER_PHONE, HEADER_PHONE_AUTH } from "../../src/lib/constants";
import { initFirebase } from "../helpers/firebase";
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

  if (!headers[HEADER_PHONE]) {
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

  await initFirebase();

  try {
    const data = await fetchNodeApp(`/verify`, {
      method: 'GET',
      headers: {
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
