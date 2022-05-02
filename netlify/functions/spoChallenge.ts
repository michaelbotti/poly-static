import {
    Handler,
    HandlerEvent,
    HandlerContext,
    HandlerResponse,
} from "@netlify/functions";

import jwt, { JwtPayload } from "jsonwebtoken";

import { passesRecaptcha } from "../helpers/recaptcha";
import { botResponse, unauthorizedResponse } from "../helpers/response";
import { HEADER_RECAPTCHA, HEADER_RECAPTCHA_FALLBACK, MAX_ACCESS_LENGTH, MAX_ACCESS_LENGTH_SPO } from "../../src/lib/constants";
import { getSecret } from "../helpers";
import { getAccessTokenCookieName } from "../helpers/util";

export interface SpoChallengeResponseBody {
    error: boolean,
    message: string;
    domain?: string;
    nonce?: string;
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

    const mockedResult = {
        error: false,
        message: `Challenge successful`,
        challengeResult: {
            status: 'ok',
            domain: 'adahandle.com',
            nonce: '119141b4ee1b65ea330b2e1f12c5611bdbd6810eb02e257f8bf549c2e2c149ce8f80648bbd3cb3e91619f5197fb50b90a29018e7b59aedfe21a9ed383619f81b'
        }
    }

    const result = {
        error: mockedResult.error,
        message: mockedResult.message,
        domain: mockedResult.challengeResult.domain,
        nonce: mockedResult.challengeResult.nonce,
    }

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
};

export { handler };
