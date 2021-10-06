import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import "cross-fetch/polyfill";
import gql from "graphql-tag";

import { HEADER_APPCHECK } from "../../src/lib/constants";
import { verifyAppCheck, getApolloClient } from "../helpers";

export interface ChainLoadResponseBody {
  load: number;
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

  const apolloClient = getApolloClient();
  const { data: { cardano, blocks_aggregate } } = await apolloClient.query({
    query: gql`
      query {
        cardano {
          currentEpoch {
            protocolParams {
              maxBlockBodySize
            }
          }
        }
        blocks_aggregate(
          limit:20,
          order_by:{
            forgedAt: desc
          }
        ) {
          aggregate {
            avg {
              size
            }
          }
        }
      }
    `,
    fetchPolicy: 'network-only',
  });

  const maxSize = cardano?.currentEpoch?.protocolParams?.maxBlockBodySize;
  const avgSize = blocks_aggregate?.aggregate?.avg?.size;
  const load =  avgSize / maxSize;
  console.log(load);

  return {
    statusCode: 200,
    body: JSON.stringify({
      load
    } as ChainLoadResponseBody),
  };
};

export { handler };
