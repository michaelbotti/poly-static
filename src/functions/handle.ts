import { Handler, HandlerEvent, HandlerContext, HandlerCallback } from "@netlify/functions";
import { normalizeNFTHandle } from "../lib/helpers/nfts";

import { BETA_PHASE_MATCH } from '../lib/constants';

export interface HandleAvailableResponseGETBody {
    available: boolean;
    message: string;
    link?: string;
}

const _handle_GET: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { headers } = event;

    if (!headers['x-handle']) {
        const response: HandleAvailableResponseGETBody = {
            message: 'No handle was provided',
            available: false,
            link: null
        };

        return {
            statusCode: 400,
            body: JSON.stringify(response)
        }
    }

    const handle = normalizeNFTHandle(headers['x-handle']);

    if (!handle.match(BETA_PHASE_MATCH)) {
        const response: HandleAvailableResponseGETBody = {
            message: 'Beta launch handles must be 3+ characters.',
            available: false
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    }

    // Simulate taken handle.
    const response: HandleAvailableResponseGETBody = await new Promise((res, rej) => {
        setTimeout(() => {
            if ('onchain' === handle) {
                res({
                    available: false,
                    link: 'https://cardanoscan.com',
                    message: 'Handle already owned!'
                });
            } else {
                res({
                    available: true,
                    message: 'Available!',
                    link: null
                });
            }
        }, 400)
    });

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext, callback: HandlerCallback) => {
    switch(event.httpMethod) {
        case 'GET':
            return await _handle_GET(event, context, callback);
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'Not support method.'
        })
    }
};

export { handler };