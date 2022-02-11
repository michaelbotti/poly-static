import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { SessionResponseBody } from "../../netlify/functions/session";
import { StateResponseBody } from "../../netlify/functions/state";
import { VerifyResponseBody } from "../../netlify/functions/verify";
import { Status, WorkflowStatus } from "../../netlify/helpers/util";
import { HandleResponseBody } from "../lib/helpers/search";
import { getAccessTokenFromCookie } from "../lib/helpers/session";

export interface ReservedHandlesType {
  blacklist: string[];
  twitter: string[];
  manual: string[];
  spos: string[];
}

export enum CreatedBySystem {
  UI = "UI",
  CLI = "CLI",
  SPO = "SPO",
}

export interface ActiveSessionType {
  emailAddress: string;
  cost: number;
  refundAmount?: number;
  handle: string;
  paymentAddress: string;
  returnAddress?: string;
  start: number;
  id?: string;
  txId?: string;
  createdBySystem: CreatedBySystem;
  status?: Status;
  workflowStatus?: WorkflowStatus;
  attempts?: number;
  dateAdded?: number;
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
  currentIndex: number;
  stateData: StateResponseBody;
  primed: boolean;
  isPurchasing: boolean;
  stateLoading: boolean;
  currentAccess: false | VerifyResponseBody;
  setReservedHandles: Dispatch<SetStateAction<ReservedHandlesType>>;
  setHandleResponse: Dispatch<SetStateAction<HandleResponseBody>>;
  setTwitterToken: Dispatch<SetStateAction<string>>;
  setIsPurchasing: Dispatch<SetStateAction<boolean>>;
  setPendingSessions: Dispatch<SetStateAction<string[]>>;
  setPaymentSessions: Dispatch<SetStateAction<PaymentSession[]>>;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  setStateData: Dispatch<SetStateAction<StateResponseBody>>;
  setCurrentAccess: React.Dispatch<
    React.SetStateAction<false | VerifyResponseBody>
  >;
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
  currentIndex: 0,
  stateData: null,
  stateLoading: false,
  currentAccess: false,
  setHandleResponse: () => {},
  setFetching: () => {},
  setHandle: () => {},
  setIsPurchasing: () => {},
  setReservedHandles: () => {},
  setTwitterToken: () => {},
  setPendingSessions: () => {},
  setPaymentSessions: () => {},
  setCurrentIndex: () => {},
  setStateData: () => {},
  setCurrentAccess: () => {},
};

export const HandleMintContext =
  createContext<HandleMintContextType>(defaultState);

export const HandleMintContextProvider = ({ children, ...rest }) => {
  const [handle, setHandle] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [handleResponse, setHandleResponse] =
    useState<HandleResponseBody | null>(null);
  const [twitterToken, setTwitterToken] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [reservedHandles, setReservedHandles] =
    useState<ReservedHandlesType | null>(null);
  const [pendingSessions, setPendingSessions] = useState<string[]>(null);
  const [paymentSessions, setPaymentSessions] = useState<PaymentSession[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentAccess, setCurrentAccess] = useState<
    false | VerifyResponseBody
  >(false);
  const [stateData, setStateData] = useState<StateResponseBody>(null);
  const [stateLoading, setStateLoading] = useState<boolean>(false);

  useEffect(() => {
    const updatestateData = async () => {
      await fetch("/.netlify/functions/state")
        .then(async (res) => {
          const data: StateResponseBody = await res.json();
          setStateData(data);
        })
        .catch((e) => {
          setStateData(null);
          console.log(e);
        })
        .finally(() => {
          setStateLoading(false);
        });
    };

    setCurrentAccess(getAccessTokenFromCookie());
    setStateLoading(true);
    updatestateData();
  }, []);

  return (
    <HandleMintContext.Provider
      value={{
        ...defaultState,
        fetching,
        handle,
        handleResponse,
        twitterToken,
        isPurchasing,
        reservedHandles,
        pendingSessions,
        paymentSessions,
        currentIndex,
        stateData,
        setFetching,
        setHandle,
        setHandleResponse,
        setTwitterToken,
        setIsPurchasing,
        setReservedHandles,
        setPendingSessions,
        setPaymentSessions,
        setCurrentIndex,
        setStateData,
        stateLoading,
        currentAccess,
        setCurrentAccess,
      }}
    >
      {children}
    </HandleMintContext.Provider>
  );
};
