import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import * as cardano from '@emurgo/cardano-serialization-lib-nodejs';
import { verify, decode, JwtPayload, Jwt } from 'jsonwebtoken';

import { HEADER_AUTH_TOKEN, HEADER_HANDLE } from "../../src/lib/constants";
import { getApolloClient, getSecret } from "../helpers";
import { ProtocolParametersResponse, PROTOCOL_PARAMETERS } from "../helpers/apollo";
import "cross-fetch/polyfill";
import { isValid } from "../../src/lib/helpers/nfts";

const getNewAddress = async (handle: string): Promise<string> => {
  // const url = 'TESTNET' === process.env.CARDANO_NET
  //   ? process.env?.WALLET_API_URL_TESTNET
  //   : process.env?.WALLET_API_URL_MAINNET || '';

  // const bearer = 'TESTNET' === process.env.CARDANO_NET
  //   ? process.env?.WALLET_BEARER_TOKEN_TESTNET
  //   : process.env?.WALLET_BEARER_TOKEN_MAINNET;

  // const passphrase = 'TESTNET' === process.env.CARDANO_NET
  //   ? process.env?.WALLET_PASSPHRASE_TESTNET
  //   : process.env?.WALLET_PASSPHRASE_MAINNET;

  // const data = {
  //   name: `ADA Handle Payment Wallet: ${handle}`,
  //   mnemonic_sentence,
  //   passphrase,
  //   address_pool_gap: 20
  // };

  // console.log(data);

  // const wallet = await fetch(
  //   url,
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${bearer}`,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   }
  // ).then(res => res.json());

  // console.log(wallet);

  return 'addr_test1qzwgz3vw44ky307l6xese7n4vkszf7n8tyrsdu8suuw346sm29f977p5uj28anzpt5zrwhnvunq4jcpmkps8qfa3l0yqkcr26w';
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers, httpMethod } = event;

  const secret = await getSecret();
  const token = headers[HEADER_AUTH_TOKEN];
  const verified = token ? verify(token, secret) as JwtPayload : false;

  if (!verified) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        address: false,
        message: 'Unauthorized.'
      })
    }
  }

  const handle = verified.handle;

  if (!handle || !isValid(handle)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        address: false,
        message: 'Handle is not valid.'
      })
    }
  }

  if ('GET' === httpMethod) {
    const addr = await getNewAddress(handle);
    if (!addr) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          address: false,
          message: 'Could not get a new address.'
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success!',
        address: addr
      })
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      address: false,
      message: 'Must be a GET response.'
    })
  }
};

export { handler };
