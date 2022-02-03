import { HandlerResponse } from '@netlify/functions';
import { fetch } from 'cross-fetch';
import { HEADER_HANDLE } from '../../src/lib/constants';
import { getDefaultActiveSessionUnvailable, getDefaultResponseAvailable, getDefaultResponseUnvailable, getMultipleStakePoolResponse, getPaidSessionUnavailable, getReservedUnavailable, getSPOUnavailable, getStakePoolNotFoundResponse, getTwitterResponseUnvailable, HandleResponseBody } from '../../src/lib/helpers/search';
import { getActiveSessionByHandle, getReservedHandles, getStakePoolsByTicker } from './firebase';

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

export const ensureHandleAvailable = async (handle: string, isSpo = false): Promise<HandlerResponse> => {
  const activeSessionsByHandle = await getActiveSessionByHandle(handle);
  const reservedHandles = await getReservedHandles();

  const { exists, policyID, assetName } = await fetchNodeApp("exists", {
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

  if (activeSessionsByHandle && activeSessionsByHandle.status === Status.PENDING) {
    return {
      statusCode: 403,
      body: JSON.stringify(getDefaultActiveSessionUnvailable()),
    };
  }

  if (activeSessionsByHandle && activeSessionsByHandle.status === Status.PAID && activeSessionsByHandle.workflowStatus === WorkflowStatus.PENDING) {
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

  if (!isSpo && reservedHandles && reservedHandles?.spos?.includes(handle)) {
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

  if (isSpo) {
    const uppercaseHandle = handle.toUpperCase();
    const stakePools = await getStakePoolsByTicker(uppercaseHandle);
    if (stakePools.length === 0) {
      return {
        statusCode: 403,
        body: JSON.stringify(getStakePoolNotFoundResponse()),
      };
    }

    // Determine if the ticker has more than 1 result. If so, don't allow
    if (stakePools.length > 1) {
      return {
        statusCode: 403,
        body: JSON.stringify(getMultipleStakePoolResponse()),
      };
    }
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
