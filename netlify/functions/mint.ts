import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import jwt from 'jsonwebtoken';
import { fetch } from 'cross-fetch';

import { HEADER_APPCHECK, HEADER_HANDLE, HEADER_JWT_ACCESS_TOKEN, HEADER_JWT_SESSION_TOKEN } from "../../src/lib/constants";
import { getSecret, queryHandleOnchain, verifyAppCheck } from "../helpers";
import { QueryHandleOnchainResponse } from "../helpers/apollo";

export interface MintingStatusResponseBody {
  error: boolean;
  message?: string;
  res: QueryHandleOnchainResponse[]
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers, queryStringParameters } = event;

  const handles = queryStringParameters?.handles;
  const appCheck = headers[HEADER_APPCHECK];
  const accessToken = headers[HEADER_JWT_ACCESS_TOKEN];
  const sessionToken = headers[HEADER_JWT_SESSION_TOKEN];

  if (!accessToken || !sessionToken || !appCheck || !handles) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Must provide a valid access and session token.'
      } as MintingStatusResponseBody)
    };
  }

  // const verified = await verifyAppCheck(appCheck as string);
  // if (!verified) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({
  //       error: true,
  //       message: `Unauthorized. Invalid AppCheck token: ${appCheck}.`
  //     } as PaymentResponseBody)
  //   }
  // }

  const accessSecret = await getSecret('access');
  const sessionSecret = await getSecret('session');

  if (!sessionSecret || !accessSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Something went wrong with access secrets.'
      } as MintingStatusResponseBody)
    }
  }

  // Validate access token.
  const validAccessToken = jwt.verify(accessToken as string, accessSecret);
  if (!validAccessToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: true,
        message: 'Provided access token was invalid or expired.'
      } as MintingStatusResponseBody)
    }
  }

  // Validate session token.
  const sessionData = jwt.verify(sessionToken as string, sessionSecret);
  if (!sessionData) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: true,
        message: 'Provided session token was invalid or expired.'
      } as MintingStatusResponseBody)
    }
  }

  const res = await Promise.all(handles.split(',').map(async handle => await queryHandleOnchain(handle)));

  if (!res?.length) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: false,
        message: 'Could not find handle on-chain.'
      } as MintingStatusResponseBody)
    }
  }

  const data: MintingStatusResponseBody = {
    error: false,
    res
  };

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}

export { handler };
