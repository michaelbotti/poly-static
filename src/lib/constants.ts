export const MAX_SESSION_LENGTH = 600000; // 10 minutes
export const MAX_ACCESS_LENGTH = 1800000; // 30 minutes
export const STATE_INTERVAL = 60000 // 1 Minute
export const MAX_CHAIN_LOAD = 0.8;
export const RECAPTCHA_SITE_KEY = '6Ld0QUkcAAAAAN-_KvCv8R_qke8OYxotNJzIg2RP';

// Keys
export const COOKIE_SESSION_PREFIX = 'CURRENT_HANDLE_SESSION';
export const COOKIE_ACCESS_KEY = 'ADAHANDLE_HAS_ACCESS';

// Headers.
export const HEADER_HANDLE = 'x-handle';
export const HEADER_RECAPTCHA = 'x-recaptcha';
export const HEADER_TWITTER_ACCESS_TOKEN = 'x-twitter-token';
export const TWITTER_UNLOCK_HEADER = 'x-twitter-credentials';
export const HEADER_PHONE = 'x-phone';
export const HEADER_PHONE_AUTH = 'x-phone-authcode';
export const HEADER_JWT_ACCESS_TOKEN = 'x-access-token';
export const HEADER_JWT_SESSION_TOKEN = 'x-session-token';

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
