import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import * as cardano from '@emurgo/cardano-serialization-lib-nodejs';
import { verify, decode, JwtPayload } from 'jsonwebtoken';

import { HEADER_AUTH_TOKEN, HEADER_HANDLE } from "../../src/lib/constants";
import { getApolloClient, getSecret } from "../helpers";
import { ProtocolParametersResponse, PROTOCOL_PARAMETERS } from "../helpers/apollo";
import "cross-fetch/polyfill";
import { getRarityCost, isValid } from "../../src/lib/helpers/nfts";

const getTransactionToSign = async (handle: string, address: string, token: string): Promise<string|boolean> => {
  if (!isValid(handle)) {
    return false;
  }


  const cost = getRarityCost(handle);
  if (!cost) {
    return false;
  }

  const tokenData = decode(token) as JwtPayload;
  const list = cardano.MetadataList.new();
  list.add( cardano.TransactionMetadatum.new_text(Date.now().toString()) );
  list.add( cardano.TransactionMetadatum.new_text(handle) );

  console.log(Buffer.from(list.to_bytes()).toString('hex'))

  return fetch(`https://wallet.testnet.adahandle.io/v2/wallets/${process.env.WALLET_ID}/transactions-construct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${process.env.WALLET_BASIC_AUTH}`
    },
    body: JSON.stringify({
      withdrawal: null,
      payments: [
        {
          address,
          amount: {
            quantity: cost * 1000000,
            unit: "lovelace"
          }
        }
      ],
      metadata: {
        '0': {
          "bytes": Buffer.from(list.to_bytes()).toString('hex')
        },
      },
      validity_interval: {
        invalid_before: {
          quantity: Date.now() * 1000,
          unit: "second"
        },
        invalid_hereafter: {
          quantity: tokenData.exp,
          unit: "second"
        }
      }
    })
  }).then(res => res.json());
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers, httpMethod } = event;

  const secret = await getSecret();
  const token = headers[HEADER_AUTH_TOKEN];
  const verified = token ? verify(token, secret) : false;

  if (!verified) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: 'Unauthorized.'
      })
    }
  }

  const handle = headers[HEADER_HANDLE];
  const address = headers['x-address'];

  if ('GET' === httpMethod) {
    const txToSign = await getTransactionToSign(handle, address, token);
    if (!txToSign) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Something went wrong.'
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success!',
        tx: txToSign
      })
    }
  }


  const client = getApolloClient();
  const { data } = await client.query<ProtocolParametersResponse>({
    query: PROTOCOL_PARAMETERS,
    fetchPolicy: 'no-cache'
  });

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
};

export { handler };
