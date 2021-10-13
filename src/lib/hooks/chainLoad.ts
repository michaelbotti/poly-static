import { fetch } from 'cross-fetch';
import { getGraphqlEndpoint } from "./constants";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Cookie from 'js-cookie';

import { requestToken } from "../firebase";
import { HEADER_JWT_ACCESS_TOKEN, HEADER_APPCHECK, COOKIE_ACCESS_KEY, CRON_LENGTH } from "../constants";
import { JwtPayload } from "jsonwebtoken";
import { getAccessTokenFromCookie, getSessionDataCookie } from "../helpers/session";

interface VerifyResponseBody {
  error: boolean;
  token?: string;
  data?: JwtPayload;
  verified?: boolean;
  message?: string;
}

export const useChainLoad = (): [
  string | null
] => {
  const [chainLoad, setChainLoad] = useState<string>(null);

  useEffect(() => {
    const updateLoad = async () => {
      const url = process.env.NODE_ENV === 'development'
        ? 'https://graphql.testnet.adahandle.io:2002/'
        : 'https://graphql.mainnet.adahandle.io/';

      const res = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                cardano {
                  currentEpoch {
                    protocolParams {
                      maxBlockBodySize
                    }
                  }
                }
                blocks_aggregate(limit: 20, order_by: { forgedAt: desc }) {
                  aggregate {
                    avg {
                      size
                    }
                  }
                }
              }
            `,
          }),
        }
      )
      .then((res) => res.json())
      .catch((e) => console.log(e));

      const {
        cardano: {
          currentEpoch: {
            protocolParams: { maxBlockBodySize },
          },
        },
        blocks_aggregate: {
          aggregate: {
            avg: { size },
          },
        },
      } = res?.data;

      const load = Math.floor(size) / Math.floor(maxBlockBodySize);
      setChainLoad((load * 100).toString().substring(0, 5));
      console.log('updated');
    };

    updateLoad();
    const interval = setInterval(updateLoad, CRON_LENGTH);
    return () => clearInterval(interval);
  }, []);

  return [chainLoad];
}
