import React, { createContext, Dispatch, SetStateAction } from "react";

interface AppContextState {
  isConnected: boolean;
  errors: string[];
  sessionToken: string | null;
  setSessionToken: Dispatch<SetStateAction<string | null>>;
  setIsConnected: Dispatch<SetStateAction<boolean>>;
  setErrors: Dispatch<SetStateAction<string[]>>;

}

export const defaultState: AppContextState = {
  isConnected: false,
  errors: [],
  sessionToken: null,
  setIsConnected: () => {},
  setErrors: () => {},
  setSessionToken: () => {}
};

export const AppContext = createContext<AppContextState>(defaultState);
