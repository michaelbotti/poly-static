import Cookie from 'js-cookie';

import { SessionResponseBody } from "../../../netlify/functions/session";
import { COOKIE_ACCESS_KEY, COOKIE_SESSION_PREFIX, IP_ADDRESS_KEY, RECAPTCHA_SITE_KEY } from '../constants';

export const getAllCurrentSessionData = (): SessionResponseBody[] => {
  return [1,2,3].reduce((count, session, index) => {
    const data = getSessionDataCookie(index);
    if (null !== data) {
      return [...count, data];
    }

    return count;
  }, []);
}

export const getSessionDataCookie = (index: number): SessionResponseBody | null => {
  const session = Cookie.get(`${COOKIE_SESSION_PREFIX}_${index}`);
  return session ? JSON.parse(session) : null;
}

export const getSessionDataFromState = (state: SessionResponseBody | null): false | SessionResponseBody => {
  if (
    !state?.data ||
    !state?.address
  ) {
    return false;
  }

  return state;
}

export const getAccessTokenFromCookie = () => Cookie.get(COOKIE_ACCESS_KEY);
export const setAccessTokenCookie = (token: string, exp: number) => {
  Cookie.set(
    COOKIE_ACCESS_KEY,
    token,
    {
      sameSite: 'strict',
      secure: true,
      expires: new Date(Math.floor(exp) * 1000), // convert to miliseconds
    }
  )
}

export const getSessionTokenFromCookie = (index: number): SessionResponseBody | false => {
  const data = Cookie.get(`${COOKIE_SESSION_PREFIX}_${index}`);
  if (!data) {
    return false;
  }

  return JSON.parse(data);
};
export const setSessionTokenCookie = (data: SessionResponseBody, exp: Date, index: number) => {
  Cookie.set(
    `${COOKIE_SESSION_PREFIX}_${index}`,
    JSON.stringify(data),
    {
      sameSite: 'strict',
      secure: true,
      expires: new Date(exp)
    }
  )
}

export const getRecaptchaToken = async (): Promise<string> => {
  return await window.grecaptcha.ready(
    () =>
      window.grecaptcha.execute(
        RECAPTCHA_SITE_KEY,
        { action: "submit" },
        (token: string) => token
      )
  );
}
