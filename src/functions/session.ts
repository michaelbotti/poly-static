import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import * as admin from 'firebase-admin';
import 'cross-fetch/polyfill';

import { config } from '../lib/firebase';
import { normalizeNFTHandle } from '../lib/helpers/nfts';

const app = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON)),
    databaseURL: config.databaseURL
});

const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
    const { headers } = event;

    if (!headers['x-handle']) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'You must include an <x-handle> header in your request.'
            })
        }
    }

    const handle = normalizeNFTHandle(headers['x-handle']);

    // Store session.
    const currentSessionsRef = db.ref('/currentSessions');
    currentSessionsRef.push({
        handle,
        timestamp: Date.now()
    });

    // Create authentication token.
    const validated = await passesRecaptcha(headers['x-recaptcha'], headers['x-ip'] || null);
    const token = validated && admin.appCheck(app).createToken(config.appId);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Success! Session initiated.',
            token
        })
    };
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