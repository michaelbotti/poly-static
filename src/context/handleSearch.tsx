import React, { createContext, Dispatch, SetStateAction } from 'react';
import { AdditionalUserInfo, OAuthCredential } from 'firebase/auth';

import { HandleResponseBody } from '../functions/handle';

export interface TwitterProfileType {
    credentials: OAuthCredential;
    user: AdditionalUserInfo;
}

export interface HandleMintContextType {
    handle: string;
    handleResponse: HandleResponseBody | null;
    fetching: boolean;
    setFetching: Dispatch<SetStateAction<boolean>>;
    twitter: null | TwitterProfileType,
    reservedTwitterUsernames: string[];
    currentSessions: string[];
    setHandle: Dispatch<SetStateAction<string>>;
    isPurchasing: boolean;
    setHandleResponse: Dispatch<SetStateAction<HandleResponseBody>>;
    setTwitter: Dispatch<SetStateAction<TwitterProfileType>>;
    setIsPurchasing: Dispatch<SetStateAction<boolean>>;
    setCurrentSessions: Dispatch<SetStateAction<string[]>>;
}

export const defaultState: HandleMintContextType = {
    twitter: null,
    handle: '',
    fetching: false,
    handleResponse: null,
    isPurchasing: false,
    reservedTwitterUsernames: [],
    currentSessions: [],
    setHandleResponse: () => {},
    setFetching: () => {},
    setTwitter: () => {},
    setHandle: () => {},
    setIsPurchasing: () => {},
    setCurrentSessions: () => {}
};

export const HandleMintContext = createContext<HandleMintContextType>(defaultState)