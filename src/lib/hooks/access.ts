import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Cookie from 'js-cookie';

import { requestToken } from "../firebase";
import { HEADER_JWT_ACCESS_TOKEN, HEADER_APPCHECK, COOKIE_ACCESS_KEY } from "../constants";
import { JwtPayload } from "jsonwebtoken";
import { getAccessTokenFromCookie, getSessionDataCookie } from "../helpers/session";

interface VerifyResponseBody {
  error: boolean;
  token?: string;
  data?: JwtPayload;
  verified?: boolean;
  message?: string;
}

export const useAccessOpen = (): [
  boolean | null,
  Dispatch<SetStateAction<boolean>>,
  number | null,
  string | null
] => {
  const [accessOpen, setAccessOpen] = useState<boolean>(null);
  const [accessMsg, setAccessMsg] = useState<string>(null);
  const [queuePos, setQueuePos] = useState<number>(null);
  const [hasVerifiedAccess, sethasVerifiedAccess] = useState<boolean>(false);

  useEffect(() => {
    const checkAccessOpen = async () => {
      const accessToken = getAccessTokenFromCookie();
      const appCheckToken = await requestToken();
      const headers = new Headers();

      headers.append(HEADER_APPCHECK, appCheckToken);

      // We've already verified our access.
      if (hasVerifiedAccess && accessToken) {
        setAccessOpen(true);
      }

      // Must have an active access pass.
      if (!accessToken) {
        const res = await fetch(
          'http://localhost:3000/queue',
          { headers }
        ).then(res => res.json())
        .catch(e => console.log(e));

        res?.queue && setQueuePos(res?.queue);
        setAccessOpen(false);
        return;
      }

      accessToken && headers.append(HEADER_JWT_ACCESS_TOKEN, accessToken);

      try {
        const res: VerifyResponseBody = await fetch(
          'http://localhost:3000/verify',
          { headers }
        ).then(res => res.json())
        .catch(e => console.log(e));

        res?.verified && sethasVerifiedAccess(true);
        setAccessOpen(res.verified);
      } catch(e) {
        console.log(e);
        setAccessOpen(false);
        setAccessMsg('We\'re having technical difficulties. Try again later.');
      }
    };

    checkAccessOpen();

    // Recheck every 5 minutes
    setInterval(checkAccessOpen, 300000);
  }, []);

  return [accessOpen, setAccessOpen, queuePos, accessMsg];
}
