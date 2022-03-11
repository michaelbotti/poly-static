import {
    Handler,
    HandlerEvent,
    HandlerContext,
    HandlerResponse,
} from "@netlify/functions";

import { JwtPayload } from "jsonwebtoken";

import { unauthorizedResponse } from "../helpers/response";
import { HEADER_PASSWORD_PROTECTION } from "../../src/lib/constants";

export interface ResponseBody {
    allowed: boolean;
}

const handler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext
): Promise<HandlerResponse> => {
    const { headers } = event;
    const headerPassword = headers[HEADER_PASSWORD_PROTECTION];

    if (!headerPassword) {
        return unauthorizedResponse;
    }

    const result = {
        allowed: headerPassword === process.env.NODEJS_APP_PASSWORD
    }

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
};

export { handler };
