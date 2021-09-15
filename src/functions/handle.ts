import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerCallback,
  HandlerResponse,
} from "@netlify/functions";
import * as admin from "firebase-admin";
import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    gql
} from "@apollo/client";
import 'cross-fetch/polyfill';

import fs from "fs";
import { getAdditionalUserInfo, TwitterAuthProvider } from "firebase/auth";

import { config } from "../lib/firebase";
import { normalizeNFTHandle } from "../lib/helpers/nfts";
import { BETA_PHASE_MATCH, RESERVE_SESSION_LENGTH } from "../lib/constants";

export interface HandleResponseBody {
  available: boolean;
  message: string;
  twitter: boolean;
  link?: string;
}

const getTwitterUsernames = async (ids: number[]): Promise<string[]> => {
  const usernames = [];

  const fetchUsernames = async (startIndex: number = 0) => {
    const endIndex = startIndex < 900 ? startIndex + 100 : startIndex + 16;
    console.log(startIndex, endIndex);
    if (startIndex === endIndex) {
      return;
    }

    const url = new URL("/2/users", "https://api.twitter.com");
    url.searchParams.set("ids", ids.slice(startIndex, endIndex).join(","));

    return await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization:
          "Bearer AAAAAAAAAAAAAAAAAAAAAJTlTQEAAAAA7KHn69cHQWCz9WH8mOBQ0Xjb2uw%3DzMpHdJz70iRKW2eAp19ZwnhT1fIHj6votkHfdCHhHu9bz9yuBG",
      },
      redirect: "follow",
    })
      .then((res) => res.json())
      // @ts-ignore
      .then(async ({ data, errors }) => {
        data.forEach((user) => {
          usernames.push(user.username.toLowerCase());
        });

        if (endIndex !== ids.length) {
          return await fetchUsernames(endIndex);
        }
      });
  };

  await fetchUsernames();
  return usernames;
};

const getTwitterIds = async (): Promise<number[]> => {
  const ids = [];
  const getUsers = async (nextPageToken?: string) =>
    await adminAuth
      .listUsers(1000, nextPageToken)
      .then(async (listUsersResult) => {
        listUsersResult.users.forEach(async (userRecord) => {
          if (userRecord.providerData[0].uid) {
            ids.push(userRecord.providerData[0].uid);
          }
        });

        // List next batch of users.
        if (listUsersResult.pageToken) {
          return await getUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        console.log("Error listing users:", error);
      });

  await getUsers();
  return ids;
};

const app = admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON)
  )
});

const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: process.env.GRAPHQL_MAINNET_URL,
        fetch: fetch
    }),
    cache: new InMemoryCache(),
});

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
  callback: HandlerCallback
): Promise<HandlerResponse> => {
  const { headers, httpMethod } = event;

  if ("GET" !== httpMethod) {
    return { statusCode: 400 };
  }

  if (!headers["x-handle"]) {
    const response: HandleResponseBody = {
      message: "No handle was provided",
      available: false,
      twitter: false,
    };

    return {
      statusCode: 400,
      body: JSON.stringify(response),
    };
  }

  const handle = normalizeNFTHandle(headers["x-handle"]);

  if (!handle.match(BETA_PHASE_MATCH)) {
    const response: HandleResponseBody = {
      message: "Beta launch handles must be 3+ characters.",
      available: false,
      twitter: false,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  }

  // const twitterIds = await getTwitterIds();
  // const twitterUsernames = await getTwitterUsernames(twitterIds);
  // if (twitterUsernames.includes(handle)) {
  //     return {
  //         statusCode: 200,
  //         body: JSON.stringify({
  //             available: false,
  //             message: 'This handle is reserved for the Twitter user.'
  //         })
  //     }
  // }

  // const twitterData = headers['x-twitter-data'] && JSON.parse(headers['x-twitter-data']);
  // if (twitterData) {
  //     console.log(twitterData);
  // }

  // Check existing sessions or clean.
  // const sessionRef = database.ref('/currentSessions');
  // sessionRef.once('value', (data) => {
  //     console.log(data);
  // };

  // if (matchingSession) {
  //     /**
  //      * If session is valid, return as not available.
  //      * Otherwise, delete from record.
  //      */
  //     if (Date.now() - matchingSession.timestamp < RESERVE_SESSION_LENGTH) {
  //         return {
  //             statusCode: 200,
  //             body: JSON.stringify({
  //                 available: false,
  //                 message: 'This handle is being bought. Try again later.',
  //                 twitter: false
  //             } as HandleResponseBody)
  //         }
  //     } else {
  //         currentSessionsRef.child(matchingKey).remove();
  //         return {
  //             statusCode: 200,
  //             body: JSON.stringify({
  //                 available: true,
  //                 message: 'Available!',
  //                 twitter: false
  //             } as HandleResponseBody)
  //         }
  //     }
  // } else {
  //     // Store session.
  //     currentSessionsRef.push({
  //         handle,
  //         timestamp: Date.now()
  //     });
  // }

  // Example query an asset
  let fingerprint = 'doesntexist';
  if ("onchain" === handle) {
    fingerprint = 'asset1d79zgp6s9pdmp6vvcaty8tdy4c572k3avrehfr';
  }

  const {
      data: { assets }
  } = await apolloClient.query({
    query: gql`
      query assets(
          $id: String
      ) {
        assets(
          limit: 1
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
    `,
    variables: {
        id: fingerprint
    }
  });

  let res: HandleResponseBody = {
    available: true,
    message: "Available!",
    twitter: false,
  }
  
  if (assets.length) {
    res = {
        available: false,
        link: `https://cardanoscan.io/token/${assets[0].policyId}.${assets[0].assetName}`,
        message: "Handle already owned!",
        twitter: false,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
};

export { handler };
