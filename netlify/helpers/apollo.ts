import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
} from "@apollo/client";

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
