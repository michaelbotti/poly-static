import {
    Handler,
    HandlerEvent,
    HandlerContext,
    HandlerCallback,
    HandlerResponse,
} from "@netlify/functions";
import {
    HandleResponseBody,
} from "../../src/lib/helpers/search";
import {
    HEADER_ALL_SESSIONS,
    HEADER_JWT_ALL_SESSIONS_TOKEN,
} from "../../src/lib/constants";
import { fetchNodeApp } from "../helpers/util";
import jwt from "jsonwebtoken";
import { getSecret } from "../helpers";

export interface QueuePositionResponseBody {
    error: boolean;
    accessQueuePosition: number;
    mintingQueuePosition: number;
    minutes: number;
    message?: string;
}

// Main handler function for GET requests.
const handler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext,
    callback: HandlerCallback
): Promise<HandlerResponse> => {
    const { headers } = event;

    const allSessionsToken = headers[HEADER_JWT_ALL_SESSIONS_TOKEN];
    const allSessionsList = headers[HEADER_ALL_SESSIONS];

    if (!allSessionsToken || !allSessionsList) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                available: false,
                message: "Unauthorized. Missing request headers.",
            } as HandleResponseBody),
        };
    }

    // verify JWT
    const sessionSecret = await getSecret('session');
    jwt.verify(allSessionsToken, sessionSecret, (err, decoded) => {
        if (err) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    available: false,
                    message: "Unauthorized. JWT invalid.",
                } as HandleResponseBody),
            };
        }
    });

    // if JWT is valid, sign a new 30 day JWT with all the active sessions
    const AllSessionJWT = jwt.sign(
        {
            sessions: JSON.parse(allSessionsList),
        },
        sessionSecret,
        {
            expiresIn: '30 days'
        }
    );

    const res: QueuePositionResponseBody = await fetchNodeApp('mintingQueuePosition', {
        method: 'POST',
        headers: {
            [HEADER_JWT_ALL_SESSIONS_TOKEN]: AllSessionJWT,
        }
    }).then(res => {
        return res.json();
    });

    return {
        statusCode: 200,
        body: JSON.stringify(res),
    }
};

export { handler };
