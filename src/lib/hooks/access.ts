import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { getAccessTokenFromCookie } from "../helpers/session";

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
