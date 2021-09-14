import { Handler, HandlerEvent, HandlerContext, HandlerCallback, HandlerResponse } from "@netlify/functions";
import * as admin from 'firebase-admin';
import fs from 'fs';
import { getAdditionalUserInfo, TwitterAuthProvider } from 'firebase/auth';
import { normalizeNFTHandle } from "../lib/helpers/nfts";
import { BETA_PHASE_MATCH } from '../lib/constants';
import fetch from 'node-fetch';

export interface HandleResponseBody {
    available: boolean;
    message: string;
    twitter: boolean;
    link?: string;
}

const firebaseAdmin =
    admin
    .initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON))
    })
const adminAuth = firebaseAdmin.auth();


const getTwitterUsernames = async (ids: number[]): Promise<string[]> => {
    const usernames = [];
    
    const fetchUsernames = async (startIndex: number = 0) => {
        const endIndex = startIndex < 900 ? startIndex + 100 : startIndex + 16;
        console.log(startIndex, endIndex);
        if (startIndex === endIndex) {
            return;
        }

        const url = new URL('/2/users', 'https://api.twitter.com');
        url.searchParams.set('ids', ids.slice(startIndex, endIndex).join(','));

        return await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAJTlTQEAAAAA7KHn69cHQWCz9WH8mOBQ0Xjb2uw%3DzMpHdJz70iRKW2eAp19ZwnhT1fIHj6votkHfdCHhHu9bz9yuBG'
            },
            redirect: 'follow'
        })
            .then(res => res.json())
            // @ts-ignore
            .then(async ({ data, errors }) => {
                data.forEach(user => {
                    usernames.push(user.username.toLowerCase());
                });
    
                if (endIndex !== ids.length) {
                    return await fetchUsernames(endIndex)
                }
            })
    }
    
    await fetchUsernames();
    return usernames;
}

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
                console.log('Error listing users:', error);
            });
    
    await getUsers();
    return ids;
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext, callback: HandlerCallback) => {
    const { headers, httpMethod } = event;

    if ('GET' !== httpMethod) {
        return { statusCode: 400 }
    }

    if (!headers['x-handle']) {
        const response: HandleResponseBody = {
            message: 'No handle was provided',
            available: false,
            twitter: false
        };

        return {
            statusCode: 400,
            body: JSON.stringify(response)
        }
    }

    const handle = normalizeNFTHandle(headers['x-handle']);

    if (!handle.match(BETA_PHASE_MATCH)) {
        const response: HandleResponseBody = {
            message: 'Beta launch handles must be 3+ characters.',
            available: false,
            twitter: false
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
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
    

    // Simulate taken handle.
    const response: HandleResponseBody = await new Promise((res, rej) => {
        setTimeout(() => {
            if ('onchain' === handle) {
                res({
                    available: false,
                    link: 'https://cardanoscan.com',
                    message: 'Handle already owned!',
                    twitter: false
                });
            } else {
                res({
                    available: true,
                    message: 'Available!',
                    twitter: false
                });
            }
        }, 400)
    });

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
};

export { handler };