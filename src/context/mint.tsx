import React, { createContext, Dispatch, SetStateAction, useState } from "react";
import { getFirebase } from "../lib/firebase";

import { HandleResponseBody } from "../lib/helpers/search";

export interface ReservedHandlesType {
  blacklist: string[],
  twitter: string[];
  manual: string[];
  spos: string[];
}

export interface ActiveSessionType {
  ip: string;
  handle: string;
  address: string;
  paid: boolean;
  start: number;
}

export interface HandleMintContextType {
  handle: string;
  handleResponse: HandleResponseBody | null;
  fetching: boolean;
  setFetching: Dispatch<SetStateAction<boolean>>;
  twitterToken: string | null;
  setHandle: Dispatch<SetStateAction<string>>;
  reservedHandles: ReservedHandlesType | null;
  primed: boolean;
  isPurchasing: boolean;
  setPrimed: Dispatch<SetStateAction<boolean>>;
  setReservedHandles: Dispatch<SetStateAction<ReservedHandlesType | null>>;
  setHandleResponse: Dispatch<SetStateAction<HandleResponseBody | null>>;
  setTwitterToken: Dispatch<SetStateAction<string | null>>;
  setIsPurchasing: Dispatch<SetStateAction<boolean>>;
}

export const defaultState: HandleMintContextType = {
  handle: "",
  fetching: false,
  handleResponse: null,
  isPurchasing: false,
  reservedHandles: null,
  twitterToken: null,
  primed: false,
  setHandleResponse: () => {},
  setFetching: () => {},
  setHandle: () => {},
  setIsPurchasing: () => {},
  setReservedHandles: () => {},
  setTwitterToken: () => {},
  setPrimed: () => {}
};

export const HandleMintContext =
  createContext<HandleMintContextType>(defaultState);

export const HandleMintContextProvider = ({ children, ...rest }) => {
  const [handle, setHandle] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [handleResponse, setHandleResponse] = useState<HandleResponseBody|null>(null);
  const [twitterToken, setTwitterToken] = useState<string|null>(null);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [reservedHandles, setReservedHandles] = useState<ReservedHandlesType|null>(null);
  const [primed, setPrimed] = useState<boolean>(false);

  return (
    <HandleMintContext.Provider value={{
      ...defaultState,
      fetching,
      handle,
      handleResponse,
      twitterToken,
      isPurchasing,
      reservedHandles,
      primed,
      setFetching,
      setHandle,
      setHandleResponse,
      setTwitterToken,
      setIsPurchasing,
      setReservedHandles,
      setPrimed
    }}>
      {children}
    </HandleMintContext.Provider>
  )
}
