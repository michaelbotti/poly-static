import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { SessionResponseBody } from "../../netlify/functions/session";

import { HandleResponseBody } from "../lib/helpers/search";
import { getAllCurrentSessionData } from "../lib/helpers/session";

export interface ReservedHandlesType {
  blacklist: string[],
  twitter: string[];
  manual: string[];
  spos: string[];
}

export interface ActiveSessionType {
  phoneNumber: string;
  cost: number;
  handle: string;
  start: number;
  walletIndex: number;
  paymentAddress: string;
  txId?: string;
}

interface PaymentSession {
  sessionResponse: SessionResponseBody;
}

export interface HandleMintContextType {
  handle: string;
  handleResponse: HandleResponseBody;
  fetching: boolean;
  setFetching: Dispatch<SetStateAction<boolean>>;
  twitterToken: string;
  setHandle: Dispatch<SetStateAction<string>>;
  reservedHandles: ReservedHandlesType;
  pendingSessions: string[];
  paymentSessions: PaymentSession[];
  primed: boolean;
  isPurchasing: boolean;
  setPrimed: Dispatch<SetStateAction<boolean>>;
  setReservedHandles: Dispatch<SetStateAction<ReservedHandlesType>>;
  setHandleResponse: Dispatch<SetStateAction<HandleResponseBody>>;
  setTwitterToken: Dispatch<SetStateAction<string>>;
  setIsPurchasing: Dispatch<SetStateAction<boolean>>;
  setPendingSessions: Dispatch<SetStateAction<string[]>>;
  setPaymentSessions: Dispatch<SetStateAction<PaymentSession[]>>;
}

export const defaultState: HandleMintContextType = {
  handle: "",
  fetching: false,
  handleResponse: null,
  isPurchasing: false,
  reservedHandles: null,
  pendingSessions: [],
  paymentSessions: [],
  twitterToken: null,
  primed: false,
  setHandleResponse: () => {},
  setFetching: () => {},
  setHandle: () => {},
  setIsPurchasing: () => {},
  setReservedHandles: () => {},
  setTwitterToken: () => {},
  setPrimed: () => {},
  setPendingSessions: () => {},
  setPaymentSessions: () => {}
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
  const [pendingSessions, setPendingSessions] = useState<string[]>(null);
  const [paymentSessions, setPaymentSessions] = useState<PaymentSession[]>([]);
  const [primed, setPrimed] = useState<boolean>(false);

  useEffect(() => {
    const paymentSessions = getAllCurrentSessionData();
    setPaymentSessions(paymentSessions.map(session => ({
      sessionResponse: session
    })));
  }, []);

  return (
    <HandleMintContext.Provider value={{
      ...defaultState,
      fetching,
      handle,
      handleResponse,
      twitterToken,
      isPurchasing,
      reservedHandles,
      pendingSessions,
      paymentSessions,
      primed,
      setFetching,
      setHandle,
      setHandleResponse,
      setTwitterToken,
      setIsPurchasing,
      setReservedHandles,
      setPrimed,
      setPendingSessions,
      setPaymentSessions
    }}>
      {children}
    </HandleMintContext.Provider>
  )
}
