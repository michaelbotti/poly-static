import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import jwt from 'jsonwebtoken';

import { HEADER_JWT_ACCESS_TOKEN, HEADER_JWT_SESSION_TOKEN } from "../../src/lib/constants";
import { getSecret } from "../helpers";
import { initFirebase } from "../helpers/firebase";
import { fetchNodeApp } from "../helpers/util";

export interface PaymentAddressResponse {
  address: string;
  summary: {
    assetBalances: {
      quantity: string;
      asset: {
        assetName: string;
      }
    }[]
  }
}

export interface PaymentData {
  address: string;
  amount: number;
};

export interface GraphqlPaymentAddressesResponse {
  error: boolean;
  message?: string;
  addresses?: PaymentData[];
}

export interface PaymentResponseBody {
  error: boolean;
  message?: string;
  data: GraphqlPaymentAddressesResponse;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers, queryStringParameters } = event;

  const addresses = queryStringParameters?.addresses;
  const accessToken = headers[HEADER_JWT_ACCESS_TOKEN];
  const sessionToken = headers[HEADER_JWT_SESSION_TOKEN];

  if (!accessToken || !sessionToken || !addresses) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Missing required headers and parameters.'
      } as PaymentResponseBody)
    };
  }

  await initFirebase();

  const accessSecret = await getSecret('access');
  const sessionSecret = await getSecret('session');

  if (!sessionSecret || !accessSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Something went wrong with access secrets.'
      } as PaymentResponseBody)
    }
  }

  // Validate access token.
  const validAccessToken = jwt.verify(accessToken as string, accessSecret);
  if (!validAccessToken) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: true,
        message: 'Provided access token was invalid or expired.'
      } as PaymentResponseBody)
    }
  }

  // Validate session token.
  const sessionData = jwt.verify(sessionToken as string, sessionSecret);
  if (!sessionData) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: true,
        message: 'Provided session token was invalid or expired.'
      } as PaymentResponseBody)
    }
  }

  const res: GraphqlPaymentAddressesResponse = await fetchNodeApp(`/payment?addresses=${addresses}`, {
    headers: {
      [HEADER_JWT_ACCESS_TOKEN]: accessToken,
      [HEADER_JWT_SESSION_TOKEN]: sessionToken
    }
  }).then(res => res.json())

  if (res.error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: res.message || ''
      } as PaymentResponseBody)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      error: false,
      data: res
    })
  }
}

export { handler };
