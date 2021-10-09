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
  Dispatch<SetStateAction<boolean>>
] => {
  const [accessOpen, setAccessOpen] = useState<boolean>(null);

  useEffect(() => {
    const accessToken = getAccessTokenFromCookie();

    if (accessToken) {
      setAccessOpen(true);
    } else {
      setAccessOpen(false);
    }
  }, []);

  return [accessOpen, setAccessOpen];
}
