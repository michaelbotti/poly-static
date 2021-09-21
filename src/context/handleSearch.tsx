import { createContext, Dispatch, SetStateAction } from "react";

import { HandleResponseBody } from "../lib/helpers/search";

export interface ReservedHandlesType {
  twitter: string[];
  manual: string[];
  spos: string[];
}

export interface ActiveSessionType {
  ip: string;
  handle: string;
  timestamp: number;
}

export interface HandleMintContextType {
  handle: string;
  handleResponse: HandleResponseBody | null;
  fetching: boolean;
  setFetching: Dispatch<SetStateAction<boolean>>;
  twitterToken: string | null;
  setHandle: Dispatch<SetStateAction<string>>;
  reservedHandles: ReservedHandlesType | null;
  isPurchasing: boolean;
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
  setHandleResponse: () => {},
  setFetching: () => {},
  setHandle: () => {},
  setIsPurchasing: () => {},
  setReservedHandles: () => {},
  setTwitterToken: () => {}
};

export const HandleMintContext =
  createContext<HandleMintContextType>(defaultState);
