import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";

import { HEADER_PHONE } from "../../src/lib/constants";
import { fetchNodeApp, getNodeEndpointUrl } from "../helpers/util";

interface AppendAccessResponse {
  updated: boolean;
  alreadyExists: boolean;
}

export interface QueueResponseBody extends AppendAccessResponse {
  error: boolean;
  message?: string;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers } = event;
  if (!headers[HEADER_PHONE]) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Missing phone number.'
      } as QueueResponseBody)
    }
  }

  console.log(
    getNodeEndpointUrl(),
    process.env.APP_ENV,
    HEADER_PHONE
  )

  try {
    const data: QueueResponseBody = await fetchNodeApp(`queue`, {
      method: 'POST',
      headers: {
        [HEADER_PHONE]: headers[HEADER_PHONE]
      }
    }).then(res => res.json())
    .catch(e => console.log(e));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: e.toString()
      } as QueueResponseBody)
    };
  }
};

export { handler };
