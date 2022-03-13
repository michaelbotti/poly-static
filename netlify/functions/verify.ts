import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import jwt, { JwtPayload } from 'jsonwebtoken';

import { HEADER_EMAIL, HEADER_EMAIL_AUTH, MAX_SESSION_LENGTH } from "../../src/lib/constants";
import { getSecret } from "../helpers";
import { getCachedState, initFirebase } from "../helpers/firebase";
import { fetchNodeApp } from "../helpers/util";

export interface VerifyResponseBody {
  error: boolean;
  token?: string;
  data?: JwtPayload;
  verified?: boolean;
  message?: string;
  tokens?: {
    token: string;
    data: JwtPayload
  }[];

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
    const resultData = await fetchNodeApp(`verify`, {
      method: 'GET',
      headers: {
        [HEADER_EMAIL]: headers[HEADER_EMAIL],
        [HEADER_EMAIL_AUTH]: headers[HEADER_EMAIL_AUTH]
      }
    }).then(res => res.json());

    if (resultData.activeSessions && resultData.activeSessions.length > 0) {
      const sessionSecret = await getSecret('session');
      const data = await getCachedState();
      const expiresIn = data?.accessWindowTimeoutMinutes * 60 * 1000 ?? MAX_SESSION_LENGTH;
      const tokens = resultData.activeSessions?.map(session => {
        const jwtToken = jwt.sign(
          {
            iat: Date.now(),
            handle: session.handle,
            // cost is coming in from the session so it will be lovelace
            cost: session.cost / 1000000,
            emailAddress: session.emailAddress,
            isSPO: false
          },
          sessionSecret,
          {
            expiresIn: (expiresIn * 1000).toString()
          }
        );
        return {
          token: jwtToken,
          data: jwt.decode(jwtToken),
          address: session.paymentAddress,
        }
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          ...resultData,
          tokens
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(resultData),
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
