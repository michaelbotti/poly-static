import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import "cross-fetch/polyfill";
import gql from "graphql-tag";
import { JwtPayload } from "jsonwebtoken";

import { HEADER_APPCHECK } from "../../src/lib/constants";
import { verifyAppCheck, getApolloClient } from "../helpers";

interface AccessResponseBody {
  access: boolean;
  token?: string;
  payload?: JwtPayload
}

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

  let access = false;
  const { load } = await fetch(`${process.env.URL}/.netlify/functions/chain-load`, {
    headers: { [HEADER_APPCHECK]: headers[HEADER_APPCHECK] }
  }).then(res => res.json());

  if (load < .60) {
    access = true;
  }

  const res: AccessResponseBody = {
    access
  };

  return {
    statusCode: 200,
    body: JSON.stringify(res)
  };
};

export { handler };
