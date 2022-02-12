export const MAX_SESSION_LENGTH = 600000; // 10 minutes
export const MAX_SESSION_LENGTH_SPO = 3600000; // 24 hours
export const MAX_ACCESS_LENGTH = 1800000; // 30 minutes
export const MAX_ACCESS_LENGTH_SPO = 3600000; // 24 hours
export const STATE_INTERVAL = 60000 // 1 Minute
export const MAX_CHAIN_LOAD = 0.8;
export const SPO_ADA_HANDLE_COST = 250;
export const RECAPTCHA_SITE_KEY = '6Ld0QUkcAAAAAN-_KvCv8R_qke8OYxotNJzIg2RP';
export const RECAPTCHA_SITE_KEY_FALLBACK = '6LejHmcdAAAAAG2537Bd-_uM2f-hazWd-Q8rFO_L';
export const MAX_TOTAL_SESSIONS = 3;
export const SPO_MAX_TOTAL_SESSIONS = 1;

// Keys
export const COOKIE_SESSION_PREFIX = 'CURRENT_HANDLE_SESSION';
export const COOKIE_ACCESS_KEY = 'ADAHANDLE_HAS_ACCESS';

// Headers.
export const HEADER_HANDLE = 'x-handle';
export const HEADER_IS_SPO = 'x-is-spo';
export const HEADER_RECAPTCHA = 'x-recaptcha';
export const HEADER_RECAPTCHA_FALLBACK = 'x-recaptcha-fallback';
export const HEADER_TWITTER_ACCESS_TOKEN = 'x-twitter-token';
export const TWITTER_UNLOCK_HEADER = 'x-twitter-credentials';
export const HEADER_EMAIL = 'x-email';
export const HEADER_EMAIL_AUTH = 'x-email-authcode';
export const HEADER_JWT_ACCESS_TOKEN = 'x-access-token';
export const HEADER_JWT_SESSION_TOKEN = 'x-session-token';
export const HEADER_CLIENT_IP = 'x-nf-client-connection-ip';
export const REFUND_POLICY_DATE = '72 hours';

/**
 * a-z
 * 0-9
 * _
 * -
 * .
 */
export const ALLOWED_CHAR = new RegExp(/^[a-zA-Z|0-9|\-|\_|\.]*$/g);

/**
 * Must match all:
 * - 4 characters or more
 */
export const BETA_PHASE_MATCH: RegExp = new RegExp(/.{2,}/g);
