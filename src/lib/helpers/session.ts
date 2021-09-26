import Cookie from 'js-cookie';
import { SessionResponseBody } from "../../../netlify/functions/session";

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
    !state?.handle ||
    !state?.token ||
    !state?.data
  ) {
    return false;
  }

  return state;
}
