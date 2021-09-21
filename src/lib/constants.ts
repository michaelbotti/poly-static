export const RESERVE_EXPIRE_DATE = new Date('10/23/2021');
export const RESERVE_SESSION_LENGTH = 600000; // 10 minutes
export const RECAPTCHA_SITE_KEY = '6Ld0QUkcAAAAAN-_KvCv8R_qke8OYxotNJzIg2RP';
export const HEADER_APPCHECK = 'x-firebase-appcheck';
export const HEADER_HANDLE = 'x-handle';
export const HEADER_RECAPTCHA = 'x-recaptcha';
export const HEADER_TWITTER_ACCESS_TOKEN = 'x-twitter-token';
export const HEADER_IP_ADDRESS = 'x-ip-address';
export const TWITTER_UNLOCK_HEADER = 'x-twitter-credentials';
export const REDIS_RESERVED_HANDLES_KEY = 'reservedHandles';
export const REDIS_ACTIVE_SESSIONS_HANDLE_KEY = 'activeSessionsHandle';
export const REDIS_ACTIVE_SESSIONS_IP_PREFIX = 'activeSessionsIP'

/**
 * a-z
 * 0-9
 * _
 * -
 */
export const ALLOWED_CHAR = new RegExp(/^[a-zA-Z|0-9|\-|\_]*$/g);

/**
 * Must match all:
 * - 4 characters or more
 */
export const BETA_PHASE_MATCH: RegExp = new RegExp(/.{4,}/g);
