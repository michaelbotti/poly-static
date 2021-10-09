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
      uri: process.env.GRAPHQL_MAINNET_URL,
      fetch: fetch,
    }),
    cache: new InMemoryCache(),
  });

  return apolloClient;
};

interface QueryHandleOnchainResponse {
  exists: boolean;
  assetName?: string;
  policyId?: string;
}

export const queryHandleOnchain = async (handle: string): Promise<QueryHandleOnchainResponse> => {
  const client = getApolloClient();

  /**
   * Example query to demonstrate chain lookup.
   * Later we'll need to encode the fingerprint
   * with cardano-lib based on:
   * - assetName.policyId
   */
  let fingerprint = handle;
  if ("onchain" === handle) {
    fingerprint = "asset1d79zgp6s9pdmp6vvcaty8tdy4c572k3avrehfr";
  }

  const {
    data: { assets },
  } = await client.query({
    variables: {
      id: fingerprint,
    },
    query: GET_ASSET_LOCATION,
  });

  const exists = !!(0 < assets.length && assets[0].policyId && assets[0].assetName);
  const data: QueryHandleOnchainResponse = { exists };

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
      limit: 1,
      where: {
        fingerprint: {
          _eq: $id
        }
      }
    ) {
      policyId
      assetName
    }
  }
`
