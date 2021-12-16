import { HandlerResponse } from '@netlify/functions';
import { fetch } from 'cross-fetch';
import { HEADER_HANDLE } from '../../src/lib/constants';
import { getDefaultActiveSessionUnvailable, getDefaultResponseAvailable, getDefaultResponseUnvailable, getPaidSessionUnavailable, getReservedUnavailable, getSPOUnavailable, getTwitterResponseUnvailable, HandleResponseBody } from '../../src/lib/helpers/search';
import { getActiveSessionByHandle, getPaidSessionByHandle, getReservedHandles } from './firebase';

export const getNodeEndpointUrl = () => process.env.NODEJS_APP_ENDPOINT;

export const ensureHandleAvailable = async (handle: string): Promise<HandlerResponse> => {
  const activeSessionsByHandle = await getActiveSessionByHandle(handle);
  const paidSession = await getPaidSessionByHandle(handle);
  const reservedHandles = await getReservedHandles();

  const { exists, policyID, assetName } = await fetchNodeApp("/exists", {
    headers: {
      [HEADER_HANDLE]: handle,
    },
  }).then((res) => res.json());

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

  if (activeSessionsByHandle) {
    return {
      statusCode: 403,
      body: JSON.stringify(getDefaultActiveSessionUnvailable()),
    };
  }

  if (paidSession) {
    return {
      statusCode: 403,
      body: JSON.stringify(getPaidSessionUnavailable()),
    };
  }

  if (reservedHandles && reservedHandles?.manual?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getReservedUnavailable()),
    };
  }

  if (reservedHandles && reservedHandles?.spos?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getSPOUnavailable()),
    };
  }

  if (reservedHandles && reservedHandles?.twitter?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getTwitterResponseUnvailable()),
    };
  }

  if (reservedHandles && reservedHandles?.blacklist?.includes(handle)) {
    return {
      statusCode: 403,
      body: JSON.stringify(getDefaultResponseUnvailable()),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(getDefaultResponseAvailable()),
  };
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

export const isProduction = () =>
  process.env.APP_ENV === 'production';

export const buildCollectionNameWithSuffix = (collectionName: string): string =>
  isProduction() ? collectionName : `${collectionName}_dev`;
