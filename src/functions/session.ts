import jwt from "jsonwebtoken";
import "cross-fetch/polyfill";
import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";

import {
  HEADER_APPCHECK,
  HEADER_HANDLE,
  HEADER_RECAPTCHA,
  HEADER_TWITTER_ACCESS_TOKEN,
  HEADER_IP_ADDRESS,
  REDIS_ACTIVE_SESSIONS_HANDLE_KEY,
  REDIS_ACTIVE_SESSIONS_IP_PREFIX,
  REDIS_RESERVED_HANDLES_KEY,
} from "../lib/constants";
import { normalizeNFTHandle } from "../lib/helpers/nfts";
import { getRedis, getS3, getFirebase, verifyAppCheck } from "../lib/functions";
import { verifyTwitterUser } from "../lib/functions/firebase";
import { ActiveSessionType, ReservedHandlesType } from "../context/handleSearch";
import {
  getActiveSessionUnavailable,
  getSessionCountUnavailable,
  HandleResponseBody,
} from "../lib/helpers/search";

const unauthorizedResponse: HandlerResponse = {
  statusCode: 403,
  body: JSON.stringify({
    message: "Unauthorized.",
  }),
};

const s3 = getS3();

/**
 * Verifies against ReCaptcha.
 * @param token
 * @param ip
 * @returns
 */
const passesRecaptcha = async (
  token: string,
  ip?: string | null
): Promise<boolean | HandlerResponse> => {
  const recaptcha_url = new URL(
    "https://www.google.com/recaptcha/api/siteverify"
  );
  recaptcha_url.searchParams.set("secret", process.env.RECAPTCHA_SECRET || "");
  recaptcha_url.searchParams.set("response", token);
  ip && recaptcha_url.searchParams.set("remoteip", ip);

  const { success, score, action } = (await (
    await fetch(recaptcha_url.toString(), {
      method: "POST",
    })
  ).json()) as { success: boolean; score: Number; action: string };

  if (!success || score < 0.8 || action !== "submit") {
    return {
      statusCode: 422,
      body: JSON.stringify({
        message:
          "Hmm, we think you might be a bot but we hope we're wrong. Please try again.",
      } as HandleResponseBody),
    };
  }

  return true;
};

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers } = event;

  const headerHandle = headers[HEADER_HANDLE];
  const headerAppCheck = headers[HEADER_APPCHECK];
  const headerRecaptcha = headers[HEADER_RECAPTCHA];
  const headerTwitter = headers[HEADER_TWITTER_ACCESS_TOKEN];
  const headerIp = headers[HEADER_IP_ADDRESS];

  if (!headerHandle || !headerAppCheck || !headerRecaptcha || !headerIp) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "Unauthorized.",
      }),
    };
  }

  // Anti-bot.
  const reCaptchaValidated = await passesRecaptcha(headerRecaptcha, headerIp);
  if (!reCaptchaValidated) {
    console.log('failed recaptcha');
    return unauthorizedResponse;
  }

  // Verified App.
  const appCheckValidated = await verifyAppCheck(headerAppCheck);
  if (!appCheckValidated) {
    console.log('failed app check');
    return unauthorizedResponse;
  }

  // Verified Twitter user.
  if (headerTwitter) {
    const exp = headerTwitter && (await verifyTwitterUser(headerTwitter));
    if (!exp || exp > Date.now()) {
      console.log('failed twitter check');
      return unauthorizedResponse;
    }
  }

  // Normalize and set session handles.
  const handle = normalizeNFTHandle(headerHandle);

  // Get session data.
  const database = (await getFirebase()).database();
  const reservedhandles = await (await database.ref('/reservedHandles').once('value', snapshot => snapshot.val())).val() as ReservedHandlesType;
  const activeSessions = await (await database.ref('/activeSessions').once('value', snapshot => snapshot.val())).val() as ActiveSessionType[];
  const ipSessionCount = activeSessions?.filter(({ ip }) => ip === headerIp).length;

  const { manual, spos } = reservedhandles;
  if (
    manual.includes(handle) ||
    spos.includes(handle) ||
    activeSessions?.filter(({ handle }) => handle === headerHandle).length > 0 ||
    ipSessionCount >= 3
  ) {
    console.log('failed reserved or spo');
    return unauthorizedResponse;
  }

  const res = await s3
    .getObject({
      Bucket: process.env.MY_AWS_BUCKET || "",
      Key: process.env.MY_AWS_JWT_SECRET_KEY || "",
    })
    .promise();

  const secret: jwt.Secret | null = res?.Body
    ? res.Body.toString("utf-8")
    : null;

  // Increment IP session.
  await database.ref('/activeSessions').transaction((currentValue) => {
    if (!currentValue) {
      return [
        {
          ip: headerIp,
          handle,
          timestamp: Date.now()
        }
      ]
    }

    return [
      ...currentValue,
      {
        ip: headerIp,
        handle,
        timestamp: Date.now()
      }
    ]
  });

  // Add handle to sessions.
  const token = jwt.sign({ headerHandle }, secret as jwt.Secret, {
    expiresIn: "10 minutes",
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success! Session initiated.",
      token
    }),
  };
};

export { handler };
