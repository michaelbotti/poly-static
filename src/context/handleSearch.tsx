import React, { createContext, Dispatch, SetStateAction } from 'react';
import { AdditionalUserInfo, OAuthCredential } from 'firebase/auth';

import { HandleResponseBody } from '../functions/handle';

export interface TwitterProfileType {
    credentials: OAuthCredential;
    user: AdditionalUserInfo;
}

export interface CurrentSessionType {
    handle: string;
    timestamp: number;
}

export interface HandleMintContextType {
    handle: string;
    handleResponse: HandleResponseBody | null;
    fetching: boolean;
    setFetching: Dispatch<SetStateAction<boolean>>;
    twitter: null | TwitterProfileType,
    setHandle: Dispatch<SetStateAction<string>>;
    isPurchasing: boolean;
    setHandleResponse: Dispatch<SetStateAction<HandleResponseBody>>;
    setTwitter: Dispatch<SetStateAction<TwitterProfileType>>;
    setIsPurchasing: Dispatch<SetStateAction<boolean>>;
}

export const defaultState: HandleMintContextType = {
    twitter: null,
    handle: '',
    fetching: false,
    handleResponse: null,
    isPurchasing: false,
    setHandleResponse: () => {},
    setFetching: () => {},
    setTwitter: () => {},
    setHandle: () => {},
    setIsPurchasing: () => {}
};

export const HandleMintContext = createContext<HandleMintContextType>(defaultState)