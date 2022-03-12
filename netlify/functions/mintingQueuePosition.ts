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
    try {
        const { headers } = event;

        const allSessionsToken = headers[HEADER_JWT_ALL_SESSIONS_TOKEN];

        if (!allSessionsToken) {
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

        const res: QueuePositionResponseBody = await fetchNodeApp('mintingQueuePosition', {
            method: 'POST',
            headers: {
                [HEADER_JWT_ALL_SESSIONS_TOKEN]: allSessionsToken,
            }
        }).then(res => {
            return res.json();
        });

        return {
            statusCode: 200,
            body: JSON.stringify(res),
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                available: false,
                error: true,
                message: 'Unexpected error.',
            }),
        };
    }
};

export { handler };
