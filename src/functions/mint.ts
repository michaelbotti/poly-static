import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import fetch from 'node-fetch';

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

    const validated = await passesRecaptcha(headers['x-recaptcha'], headers['x-ip'] || null);
    if (!validated) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'It appears our server thinks you\'re a bot.',
                promptRecaptcha: true
            } as MintReponseBody)
        }
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

const passesRecaptcha = async (token: string, ip?: string): Promise<boolean | HandlerResponse> => {
    const recaptcha_url = new URL('https://www.google.com/recaptcha/api/siteverify');
    recaptcha_url.searchParams.set('secret', process.env.RECAPTCHA_SECRET);
    recaptcha_url.searchParams.set('response', token);
    ip && recaptcha_url.searchParams.set('remoteip', ip);

    const { success, score, action } = await (await fetch(recaptcha_url.toString(), {
        method: 'POST'
    })).json() as { success: boolean; score: Number; action: string };

    if (!success || score < .8 || action !== 'submit') {
        return {
            statusCode: 422,
            body: JSON.stringify({ message: 'Hmm, we think you might be a bot but we hope we\'re wrong. Please try again.' } as HandleResponseBody),
        };
    }

    return true;
}

export { handler };