import Cookie from 'js-cookie';
import { JwtPayload } from 'jsonwebtoken';

import { SessionResponseBody } from "../../../netlify/functions/session";
import { VerifyResponseBody } from '../../../netlify/functions/verify';
import { COOKIE_ACCESS_KEY, COOKIE_ALL_SESSIONS_KEY, COOKIE_SESSION_PREFIX, RECAPTCHA_SITE_KEY, SPO_COOKIE_ACCESS_KEY, SPO_COOKIE_SESSION_PREFIX, SPO_MAX_TOTAL_SESSIONS } from '../constants';

export interface AllSessionsData {
  handle: string;
  dateAdded: number;
  status: 'pending' | 'paid' | 'refund';
}

export interface AllSessionsDataBody {
  token: string;
  data: JwtPayload;
}

export const getAllCurrentSessionData = (): (SessionResponseBody | false)[] => {
  return [1, 2, 3].reduce((sessions, index) => {
    const data = getSessionTokenFromCookie(index);
    if (null !== data) {
      sessions.push(data);
    }

    return sessions;
  }, []);
}

export const getAllCurrentSPOSessionData = (): (SessionResponseBody | false)[] => {
  const sessions = [];
  Array.from({ length: SPO_MAX_TOTAL_SESSIONS }, (_, index) => {
    const data = getSPOSessionTokenFromCookie(index + 1);
    if (null !== data) {
      sessions.push(data);
    }
  });
  return sessions;
}

export const getSPOAccessTokenCookie = (): VerifyResponseBody | false => getAccessTokenFromCookie(true);
export const setSPOAccessTokenCookie = (data: VerifyResponseBody, exp: number): void => setAccessTokenCookie(data, exp, true);
export const getSPOSessionTokenFromCookie = (index: number): SessionResponseBody | false => getSessionTokenFromCookie(index, true);
export const setSPOSessionTokenCookie = (data: SessionResponseBody, exp: Date, index: number): void => setSessionTokenCookie(data, exp, index, true);

export const getAccessTokenFromCookie = (isSPO = false): VerifyResponseBody | false => {
  const cookieName = isSPO ? SPO_COOKIE_ACCESS_KEY : COOKIE_ACCESS_KEY;
  const data = Cookie.get(cookieName);
  if (!data || data.length === 0) {
    return false;
  }

  return JSON.parse(data);
}

export const setAccessTokenCookie = (data: VerifyResponseBody, exp: number, isSPO = false) => {
  Cookie.set(
    isSPO ? SPO_COOKIE_ACCESS_KEY : COOKIE_ACCESS_KEY,
    JSON.stringify(data),
    {
      sameSite: 'strict',
      secure: true,
      expires: new Date(Math.floor(exp) * 1000), // convert to miliseconds
    }
  )
}

export const getSessionTokenFromCookie = (index: number, isSPO = false): SessionResponseBody | false => {
  const cookieName = isSPO ? `${SPO_COOKIE_SESSION_PREFIX}_${index}` : `${COOKIE_SESSION_PREFIX}_${index}`;
  const data = Cookie.get(cookieName);
  if (!data || data.length === 0) {
    return false;
  }

  return JSON.parse(data);
};

export const setSessionTokenCookie = (data: { token: string, data: JwtPayload, address: string }, exp: Date, index: number, isSPO = false) => {
  const cookieName = isSPO ? `${SPO_COOKIE_SESSION_PREFIX}_${index}` : `${COOKIE_SESSION_PREFIX}_${index}`;
  Cookie.set(
    cookieName,
    JSON.stringify(data),
    {
      sameSite: 'strict',
      secure: true,
      expires: new Date(exp)
    }
  )
}

export const getAllCurrentSessionCookie = (): AllSessionsDataBody | null => {
  const data = Cookie.get(`${COOKIE_ALL_SESSIONS_KEY}`);
  if (!data || data.length === 0) {
    return null;
  }

  return JSON.parse(data);
}

export const setAllSessionsCookie = (data: AllSessionsDataBody) => {
  Cookie.set(
    `${COOKIE_ALL_SESSIONS_KEY}`,
    JSON.stringify(data),
    {
      sameSite: 'strict',
      secure: true,
      expires: 30 // days
    }
  )
}

export const getRecaptchaToken = async (): Promise<string> => {
  return await (window as any).grecaptcha.execute(
    RECAPTCHA_SITE_KEY,
    { action: "submit" },
    (token: string) => {
      return token;
    }
  );
}
