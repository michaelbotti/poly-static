import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import 'cross-fetch/polyfill';

interface MintReponseBody {
    message: string;
    promptRecaptcha?: boolean;
    success?: boolean;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
    const { headers } = event;

    if (!headers['x-recaptcha']) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'A ReCaptcha token is required.',
            } as MintReponseBody)
        };
    }

    if (headers['x-twitter-credentials']) {
        // validate user.
    }

    return {
        statusCode: 500,
        body: JSON.stringify({
            message: 'Something went wrong.'
        } as HandleResponseBody)
    }
}

export { handler };