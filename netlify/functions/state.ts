import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";

import { fetchNodeApp } from "../helpers/util";

export interface StateResponseBody {
  error: boolean;
  message?: string;
  chainLoad?: number | null;
  position?: number;
  totalHandles?: number;
}

export interface QueueResponseBody extends StateResponseBody {
  error: boolean;
  message?: string;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  try {
    const data: QueueResponseBody = await fetchNodeApp(`/state`).then(res => res.json());
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
