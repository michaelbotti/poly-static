import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MAX_ACCESS_LENGTH, MAX_SESSION_LENGTH } from "../constants";

import { getAccessTokenFromCookie } from "../helpers/session";

export const useAccessOpen = (): [
  boolean | null,
  Dispatch<SetStateAction<boolean>>
] => {
  const [accessOpen, setAccessOpen] = useState<boolean>(null);

  useEffect(() => {
    const updateAccess = () => {
      const accessToken = getAccessTokenFromCookie();
      console.log(accessToken)

      if (accessToken && Date.now () - accessToken.data.exp < MAX_ACCESS_LENGTH) {
        setAccessOpen(true);
      } else {
        setAccessOpen(false);
      }
    }

    updateAccess();
    const interval = setInterval(updateAccess, 10000);

    return () => clearInterval(interval);
  }, []);

  return [accessOpen, setAccessOpen];
}
