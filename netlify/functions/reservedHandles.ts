import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import jwt from 'jsonwebtoken';
import { ReservedHandlesType } from "../../src/context/mint";

import { HEADER_JWT_ACCESS_TOKEN } from "../../src/lib/constants";
import { getSecret } from "../helpers";
import { getReservedHandles, initFirebase } from "../helpers/firebase";

interface ReservedHandlesResponses {
  error: boolean;
  message?: string;
  data: ReservedHandlesType;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers } = event;
  const accessToken = headers[HEADER_JWT_ACCESS_TOKEN];

  if (!accessToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Missing required headers and parameters.'
      } as ReservedHandlesResponses)
    };
  }

  await initFirebase();

  const accessSecret = await getSecret('access');

  if (!accessSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Something went wrong with access secrets.'
      } as ReservedHandlesResponses)
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
      } as ReservedHandlesResponses)
    }
  }

  const reservedHandles = await getReservedHandles();

  if (!reservedHandles) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Reserved handles could not be found.'
      } as ReservedHandlesResponses)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      error: false,
      data: reservedHandles
    } as ReservedHandlesResponses)
  }
}

export { handler };
