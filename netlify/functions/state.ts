import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import { getCachedState, initFirebase } from "../helpers/firebase";

import { fetchNodeApp } from "../helpers/util";

export interface StateData {
  chainLoad?: number | null;
  position?: number;
  totalHandles?: number;
}

export interface StateResponseBody extends StateData {
  error: boolean;
  message?: string;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  await initFirebase();

  try {
    const data = await getCachedState();
    if (!data) {
      throw Error('No state data!');
    }
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
      } as StateResponseBody)
    };
  }
};

export { handler };
