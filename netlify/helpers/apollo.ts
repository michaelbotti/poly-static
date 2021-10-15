import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
} from "@apollo/client";
import cardano from '@emurgo/cip14-js';

let apolloClient: ApolloClient<NormalizedCacheObject>;
export const getApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  if (apolloClient) {
    return apolloClient;
  }

  apolloClient = new ApolloClient({
    link: new HttpLink({
      uri: process.env.NODE_ENV === 'development' ? process.env.GRAPHQL_TESTNET_URL : process.env.GRAPHQL_MAINNET_URL,
      fetch: fetch,
    }),
    cache: new InMemoryCache(),
  });

  return apolloClient;
};

export interface QueryHandleOnchainResponse {
  exists: boolean;
  assetName?: string;
  policyId?: string;
  txHash?: string;
}

export const queryHandleOnchain = async (handle: string): Promise<QueryHandleOnchainResponse> => {
  const client = getApolloClient();

  let fingerprint = cardano.fromParts(
    Buffer.from('5b7e2b5608c0f38eb186241f8b883d2e7bcad382f78c1e4e8993e513', 'hex'),
    Buffer.from(handle)
  );

  const {
    data: { assets, txHash },
  } = await client.query({
    variables: {
      id: fingerprint.fingerprint(),
    },
    query: GET_ASSET_LOCATION,
  });

  const exists = !!(0 < assets.length && assets[0].policyId && assets[0].assetName);
  const data: QueryHandleOnchainResponse = { exists, txHash };

  if (exists) {
    data.assetName = assets[0].assetName;
    data.policyId = assets[0].policyId;
  }

  return data;
};

export const PROTOCOL_PARAMETERS = gql`
  query ProtocolParams {
    cardano {
      tip {
        slotNo
      }
      currentEpoch {
        protocolParams {
          minFeeA
          minFeeB
          minUTxOValue
          poolDeposit
          keyDeposit
          maxTxSize
          maxValSize
        }
      }
    }
  }
`

export interface ProtocolParametersResponse {
  cardano: {
    tip: {
      slotNo: number;
    },
    currentEpoch: {
      protocolParams: {
        minFeeA: number;
        minFeeB: number;
        minUTxOValue: number;
        poolDeposit: number;
        keyDeposit: number;
        maxTxSize: number;
        maxValSize: string;
      }
    }
  }
}

export const GET_ASSET_LOCATION = gql`
  query GetAssetLocation ($id: String) {
    assets(
      limit: 2,
      where: {
        fingerprint: {
          _eq: $id
        }
      }
    ) {
      policyId
      assetName
      tokenMints {
        transaction {
          outputs(
            order_by: {
              index:asc
            }
          ) {
            address
            txHash
          }
        }
      }
    }
  }
`
