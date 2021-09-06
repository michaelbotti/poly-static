import { Handler } from "@netlify/functions";
import fetch from 'node-fetch';

interface RecaptchaResponse {
  success: boolean;
  challeng_ts: Date;
  hostname: string;
  score?: number;
  action?: string;
  'error-codes'?: string[]
}

const handler: Handler = async (event, context) => {
  const { headers } = event;

  const recaptcha_url = new URL('https://www.google.com/recaptcha/api/siteverify');
  recaptcha_url.searchParams.set('secret', process.env.RECAPTCHA_SECRET);
  recaptcha_url.searchParams.set('response', headers['x-recaptcha']);
  recaptcha_url.searchParams.set('remoteip', headers['client-ip']);

  const { success, score, action } = await (await fetch(recaptcha_url.toString(), {
    method: 'POST'
  })).json() as RecaptchaResponse;

  if (!success || score < .8 || action !== 'submit') {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Hmm, we think you might be a bot but we hope we\'re wrong. Please try again.' }),
    };
  }

  // Mint token
};

export { handler };