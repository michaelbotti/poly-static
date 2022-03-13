import { JwtPayload } from "jsonwebtoken";

const RESPONSE_UNAVAILABLE_DEFAULT = 'Sorry! This Handle is unavailable.';
const RESPONSE_UNAVAILABLE_PAID = 'Sorry! This Handle is pending mint.';
const RESPONSE_UNAVAILABLE_TWITTER = 'Reserved! Please unlock with Twitter below.';
const RESPONSE_AVAILABLE_DEFAULT = 'Yay! This Handle is available.';
const RESPONSE_BETA_PHASE_UNAVAILABLE = 'Legendary Handles are not available yet.';
const RESPONSE_ACTIVE_SESSION_UNAVAILABLE = 'Pending purchase. Try again soon!';
const RESPONSE_SESSION_COUNT_UNAVAILABLE = 'Sorry! You can only have 3 active sessions at a time.';
const RESPONSE_SPO_HANDLE_UNAVAILABLE = 'Reserved for the stake pool. Email private@adahandle.com to claim!';
const RESPONSE_RESERVED_HANDLE_UNAVAILABLE = 'This Handle is reserved. Send an email to private@adahandle.com to claim it.';
const RESPONSE_SPO_HANDLE_NOT_FOUND = 'Stake pool not found. Send an email to private@adahandle.com if you believe this is incorrect.';
const RESPONSE_SPO_MULTIPLE_TICKER = 'Ticker belongs to multiple stake pools. Send an email to private@adahandle.com.';

export interface HandleResponseBody {
  available: boolean;
  message: string;
  twitter: boolean;
  ogNumber?: number;
  cost?: number;
  link?: string;
  reason?: string;
  mintingQueueSize?: number;
  mintingQueuePosition?: number;
  mintingQueueMinutes?: number;
  tooMany?: boolean;
  sessions?: {
    cost: number;
    emailAddress: string;
    handle: string;
    paymentAddress: string;
  }[];
  tokens?: {
    token: string;
    data: JwtPayload
  }[];
}

interface DefaultResponseInput { link?: string, cost?: number }
export const getDefaultResponseAvailable = (input?: DefaultResponseInput): HandleResponseBody => {
  const { link, cost } = input;
  return {
    message: RESPONSE_AVAILABLE_DEFAULT,
    available: true,
    twitter: false,
    cost,
    link
  }
};

export const getDefaultResponseUnvailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_UNAVAILABLE_DEFAULT,
  available: false,
  twitter: false,
  link
});

export const getPaidSessionUnavailable = (): HandleResponseBody => ({
  message: RESPONSE_UNAVAILABLE_PAID,
  available: false,
  twitter: false
})

export const getDefaultActiveSessionUnvailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_ACTIVE_SESSION_UNAVAILABLE,
  available: false,
  twitter: false,
  link
});

export const getTwitterResponseAvailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_AVAILABLE_DEFAULT,
  available: true,
  twitter: true,
  link
});

export const getTwitterResponseUnvailable = ({ link, ogNumber }: { link?: string, ogNumber?: number }): HandleResponseBody => ({
  message: RESPONSE_UNAVAILABLE_TWITTER,
  available: false,
  twitter: true,
  link,
  ogNumber
});

export const getBetaPhaseResponseUnavailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_BETA_PHASE_UNAVAILABLE,
  available: false,
  twitter: false,
  link
});

export const getSessionCountUnavailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_SESSION_COUNT_UNAVAILABLE,
  available: false,
  twitter: false,
  link
});

export const getReservedUnavailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_RESERVED_HANDLE_UNAVAILABLE,
  available: false,
  twitter: false,
  link
});

export const getSPOUnavailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_SPO_HANDLE_UNAVAILABLE,
  available: false,
  twitter: false,
  link
});

export const getStakePoolNotFoundResponse = (link?: string): HandleResponseBody => ({
  message: RESPONSE_SPO_HANDLE_NOT_FOUND,
  available: false,
  twitter: false,
  link
});

export const getMultipleStakePoolResponse = (link?: string): HandleResponseBody => ({
  message: RESPONSE_SPO_MULTIPLE_TICKER,
  available: false,
  twitter: false,
  link
});

export const buildUnavailableResponse = (message: string, reason: string, link?: string): HandleResponseBody => ({
  message,
  reason,
  link,
  available: false,
  twitter: false
});
