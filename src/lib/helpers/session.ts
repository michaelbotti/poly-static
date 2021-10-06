import Cookie from 'js-cookie';
import { SessionResponseBody } from "../../../netlify/functions/session";
import { COOKIE_ACCESS_KEY, HEADER_APPCHECK, HEADER_AUTH_TOKEN } from '../constants';
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
