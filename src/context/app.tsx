import React, { createContext, Dispatch, SetStateAction } from 'react';

interface AppContextState {
    isConnected: boolean;
    setIsConnected: Dispatch<SetStateAction<boolean>>;
    errors: string[];
    setErrors: Dispatch<SetStateAction<string[]>>;
}

export const defaultState: AppContextState = {
    isConnected: false,
    setIsConnected: () => {},
    errors: [],
    setErrors: () => {}
};

export const AppContext = createContext<AppContextState>(defaultState)