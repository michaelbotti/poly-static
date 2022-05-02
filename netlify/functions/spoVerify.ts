import {
    Handler,
    HandlerEvent,
    HandlerContext,
    HandlerResponse,
} from "@netlify/functions";

import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { MAX_SESSION_LENGTH_SPO } from "../../src/lib/constants";
import { getSecret } from "../helpers/jwt";

import { unauthorizedResponse } from "../helpers/response";
import { getAccessTokenCookieName } from "../helpers/util";

export interface SpoVerifyResponseBody {
    error: boolean;
    message?: string;
    token?: string;
    address?: string;
    data?: JwtPayload;
}

const handler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext
): Promise<HandlerResponse> => {
    const { headers } = event;

    const headerAccess = headers[getAccessTokenCookieName(true)];
    if (!headerAccess) {
        return unauthorizedResponse;
    }

    await new Promise(resolve => setTimeout(resolve, 3000));

    // TODO: Verify SPO.
    const mockedResult = {
        error: false,
        message: '',
        handle: 'blade',
        cost: 250,
        address: 'addr123123nskdaj2knk'
    }

    const sessionSecret = await getSecret('session');
    const sessionToken = jwt.sign(
        {
            iat: Date.now(),
            handle: mockedResult.handle,
            cost: mockedResult.cost,
            emailAddress: 'spos@adahandle.com',
            isSPO: true
        },
        sessionSecret,
        {
            expiresIn: (MAX_SESSION_LENGTH_SPO * 1000).toString()
        }
    );

    const response = {
        error: mockedResult.error,
        message: mockedResult?.message || '',
        address: mockedResult?.address || '',
        token: sessionToken,
        data: decode(sessionToken) as JwtPayload,
    }

    return {
        statusCode: 200,
        body: JSON.stringify(response),
    };
};

export { handler };
