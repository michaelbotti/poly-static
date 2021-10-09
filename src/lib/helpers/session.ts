import Cookie from 'js-cookie';

import { SessionResponseBody } from "../../../netlify/functions/session";
import { COOKIE_ACCESS_KEY, HEADER_APPCHECK, IP_ADDRESS_KEY, RECAPTCHA_SITE_KEY } from '../constants';
import { requestToken } from '../firebase';

export const SESSION_KEY = 'currentHandleSession';

export const getSessionDataCookie = (): SessionResponseBody[] => {
  const sessions = [1,2,3]
    .map(sessionIndex => {
      const session = Cookie.get(`${SESSION_KEY}_${sessionIndex}`);
      return session ? JSON.parse(session) : null;
    })
    .filter(session => null !== session)

  return sessions;
}

export const getSessionDataFromState = (state: SessionResponseBody | null): false | SessionResponseBody => {
  if (
    !state?.data ||
    !state?.token
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

export const getIpAddress = async (): Promise<string> => {
  const appCheck = await requestToken();

  if (!localStorage.getItem(IP_ADDRESS_KEY)) {
    const { ip } = await (await fetch('/.netlify/functions/ip', {
      headers: {
        [HEADER_APPCHECK]: appCheck
      }
    })).json();
    ip && localStorage.setItem(IP_ADDRESS_KEY, ip);
  }

  return localStorage.getItem(IP_ADDRESS_KEY);
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
