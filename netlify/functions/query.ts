import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import "cross-fetch/polyfill";

import { HEADER_APPCHECK } from "../../src/lib/constants";
import { verifyAppCheck, getApolloClient } from "../helpers";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers, body } = event;
  if (!headers[HEADER_APPCHECK]) {
    return {
      statusCode: 403,
      body: 'Unauthorized.'
    }
  }

  const verified = await verifyAppCheck(headers[HEADER_APPCHECK] as string);
  if (!verified) {
    return {
      statusCode: 403,
      body: 'Unauthorized.'
    }
  }

  const query = JSON.parse(body);

  const apolloClient = getApolloClient();
  const { data } = await apolloClient.query({
    ...query,
    fetchPolicy: 'no-cache'
  });

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

export { handler };
