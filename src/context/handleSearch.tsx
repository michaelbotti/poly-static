import React, { createContext, Dispatch, SetStateAction } from 'react';
import { HandleAvailableResponseGETBody } from '../functions/handle';

interface HandleMintContext {
    handle: string;
    setHandle: Dispatch<SetStateAction<string>>;
    handleResponse: HandleAvailableResponseGETBody | null;
    setHandleResponse: Dispatch<SetStateAction<HandleAvailableResponseGETBody>>;
    fetching: boolean;
    setFetching: Dispatch<SetStateAction<boolean>>;
}

export const defaultState: HandleMintContext = {
    handle: '',
    fetching: false,
    handleResponse: null,
    setHandleResponse: () => {},
    setFetching: () => {},
    setHandle: () => {}
};

export const HandleMintContext = createContext<HandleMintContext>(defaultState)