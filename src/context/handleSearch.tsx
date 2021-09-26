import { createContext, Dispatch, SetStateAction } from "react";

import { HandleResponseBody } from "../../src/lib/helpers/search";

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
  setPrimed: () => {},
};

export const HandleMintContext =
  createContext<HandleMintContextType>(defaultState);
