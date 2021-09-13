import React, { createContext, Dispatch, SetStateAction } from 'react';
import { AdditionalUserInfo, OAuthCredential } from 'firebase/auth';

import { HandleAvailableResponseGETBody } from '../functions/handle';

export interface TwitterProfileType {
    credentials: OAuthCredential;
    user: AdditionalUserInfo;
}

export interface HandleMintContextType {
    handle: string;
    setHandle: Dispatch<SetStateAction<string>>;
    handleResponse: HandleAvailableResponseGETBody | null;
    setHandleResponse: Dispatch<SetStateAction<HandleAvailableResponseGETBody>>;
    fetching: boolean;
    setFetching: Dispatch<SetStateAction<boolean>>;
    twitter: null | TwitterProfileType,
    setTwitter: Dispatch<SetStateAction<TwitterProfileType>>;
}

export const defaultState: HandleMintContextType = {
    twitter: null,
    handle: '',
    fetching: false,
    handleResponse: null,
    setHandleResponse: () => {},
    setFetching: () => {},
    setTwitter: () => {},
    setHandle: () => {}
};

export const HandleMintContext = createContext<HandleMintContextType>(defaultState)