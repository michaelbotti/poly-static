import { HandlerResponse } from '@netlify/functions';
import { fetch } from 'cross-fetch';
import { HEADER_HANDLE, HEADER_JWT_ACCESS_TOKEN, HEADER_JWT_SESSION_TOKEN, HEADER_JWT_SPO_ACCESS_TOKEN, HEADER_JWT_SPO_SESSION_TOKEN } from '../../src/lib/constants';
import { buildUnavailableResponse, getDefaultResponseAvailable, HandleResponseBody } from '../../src/lib/helpers/search';

export const getNodeEndpointUrl = () => process.env.NODEJS_APP_ENDPOINT;

export enum Status {
  REFUNDABLE = "refundable",
  PAID = "paid",
  PENDING = "pending",
  DLQ = "dlq",
}

export enum WorkflowStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SUBMITTED = "submitted",
  CONFIRMED = "confirmed",
  EXPIRED = "expired",
}

export interface HandleAvailabilityResponse {
  available: boolean;
  message?: string;
  type?: 'twitter' | 'spo' | 'private' | 'pending' | 'notallowed' | 'invalid';
  link?: string; //`https://${process.env.CARDANOSCAN_DOMAIN}/token/${policyID}.${assetName}`
  reason?: string;
  duration?: number;
}

interface FetchSearchResponse {
  status: number;
  error: boolean;
  message?: string;
  response?: HandleAvailabilityResponse
}

export const ensureHandleAvailable = async (accessToken: string, handle: string, isSPO = false): Promise<HandlerResponse> => {
  const { exists, policyID, assetName } = await fetchNodeApp("exists", {
    headers: {
      [HEADER_HANDLE]: handle,
    },
  }).then((res) => res.json());

  // First and foremost, check if the handle exists on chain.
  if (exists) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        available: false,
        link: `https://${process.env.CARDANOSCAN_DOMAIN}/token/${policyID}.${assetName}`,
        message: "Handle already exists!",
        twitter: false,
      } as HandleResponseBody),
    };
  }

  // next hit the api to check if the handle is available
  const searchResponse = await fetchNodeApp("search", {
    headers: {
      [HEADER_HANDLE]: handle,
      [getAccessTokenCookieName(isSPO)]: accessToken,
    },
  });

  const { status } = searchResponse;
  const results = await searchResponse.json() as FetchSearchResponse;

  const { error, message, response } = results;

  if (error || !response) {
    return {
      statusCode: status ?? 500,
      body: JSON.stringify({
        available: false,
        message: message || "Internal server error.",
      } as HandleResponseBody),
    };
  }

  const { available, message: responseMessage, link, type, reason } = response;

  // if it doesn't exist on chain and it's available, send message that it's available
  if (available) {
    return {
      statusCode: 200,
      body: JSON.stringify(getDefaultResponseAvailable()),
    };
  }

  // Allow SPO if type is SPO and reserved
  if (isSPO && type === 'spo') {
    return {
      statusCode: 200,
      body: JSON.stringify(getDefaultResponseAvailable()),
    };
  }

  return {
    statusCode: 403,
    body: JSON.stringify(buildUnavailableResponse(responseMessage, reason, link)),
  }
}

export const fetchNodeApp = async (
  endpoint: string,
  params: any = {}
): Promise<Response> => {
  const token = Buffer.from(
    `${process.env.NODEJS_APP_USERNAME}:${process.env.NODEJS_APP_PASSWORD}`
  ).toString('base64');

  const { headers, ...rest } = params;
  const baseUrl = getNodeEndpointUrl();

  return fetch(
    `${baseUrl}/${endpoint}`,
    {
      headers: {
        'Authorization': `Basic ${token}`,
        ...headers,
      },
      ...rest
    }
  )
}

export const isProduction = (): boolean => {
  // currently NODE_ENV is not set to 'master' in buddy
  return process.env.NODE_ENV?.trim() === 'production' || process.env.NODE_ENV?.trim() === 'master';
}

export const isTesting = (): boolean => {
  return process.env.NODE_ENV?.trim() === 'test';
}

export const isLocal = (): boolean => {
  return process.env.NODE_ENV?.trim() === 'local';
}

export const buildCollectionNameWithSuffix = (collectionName: string): string => {
  if (isProduction()) return collectionName
  else if (isTesting() || isLocal()) return `${collectionName}_test`;
  return `${collectionName}_dev`;
}

export const getAccessTokenCookieName = (isSPO = false) => {
  return isSPO ? HEADER_JWT_SPO_ACCESS_TOKEN : HEADER_JWT_ACCESS_TOKEN;
}

export const getSessionTokenCookieName = (isSPO = false) => {
  return isSPO ? HEADER_JWT_SPO_SESSION_TOKEN : HEADER_JWT_SESSION_TOKEN;
}
