import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import { JwtPayload } from 'jsonwebtoken';

import { HEADER_EMAIL, HEADER_EMAIL_AUTH } from "../../src/lib/constants";
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

  if (!headers[HEADER_EMAIL]) {
    return {
      statusCode: 400,
      body: 'Missing email address.'
    }
  }

  if (!headers[HEADER_EMAIL_AUTH]) {
    return {
      statusCode: 400,
      body: 'Missing auth code.'
    }
  }

  await initFirebase();

  try {
    const data = await fetchNodeApp(`verify`, {
      method: 'GET',
      headers: {
        [HEADER_EMAIL]: headers[HEADER_EMAIL],
        [HEADER_EMAIL_AUTH]: headers[HEADER_EMAIL_AUTH]
      }
    }).then(res => res.json());

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Unexpected error.',
      }),
    };
  }
};

export { handler };
