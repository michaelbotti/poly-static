import { Handler, HandlerEvent, HandlerContext, HandlerCallback } from "@netlify/functions";

import * as admin from 'firebase-admin';
import { getAdditionalUserInfo, TwitterAuthProvider } from 'firebase/auth';
import { normalizeNFTHandle } from "../lib/helpers/nfts";
import { BETA_PHASE_MATCH } from '../lib/constants';

export interface HandleAvailableResponseGETBody {
    available: boolean;
    message: string;
    link?: string;
}

const firebaseAdmin =
    admin
    .initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON))
    })

const adminAuth = firebaseAdmin.auth();
// const adminDB = firebaseAdmin.database().ref('https://console.firebase.google.com/u/0/project/ada-handle-reserve/database/ada-handle-reserve-default-rtdb/data/');

const handleIsTwitterUsername = async (handle: string): Promise<boolean> => {
    // const twitterUsernames = [];
    // let isTwitterUsername = false;
    // const getUsers = async (nextPageToken?: string) =>
    //     await adminAuth
    //         .listUsers(1000, nextPageToken)
    //         .then(async (listUsersResult) => {
    //             listUsersResult.users.forEach(async (userRecord) => {
    //                 twitterUsernames.push(userRecord.providerData[0].uid);
    //             });
                
    //             // List next batch of users.
    //             if (listUsersResult.pageToken) {
    //                 return await getUsers(listUsersResult.pageToken);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log('Error listing users:', error);
    //         });
    
    // await getUsers();
    // fs.writeFileSync('/Users/cjkoepke/Desktop/ids.txt', JSON.stringify(twitterUsernames));
    // return isTwitterUsername;
    return false;
}

const _handle_GET: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const { headers } = event;

    if (!headers['x-handle']) {
        const response: HandleAvailableResponseGETBody = {
            message: 'No handle was provided',
            available: false,
            link: null
        };

        return {
            statusCode: 400,
            body: JSON.stringify(response)
        }
    }

    const handle = normalizeNFTHandle(headers['x-handle']);

    if (!handle.match(BETA_PHASE_MATCH)) {
        const response: HandleAvailableResponseGETBody = {
            message: 'Beta launch handles must be 3+ characters.',
            available: false
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    }

    // Check Twitter reserved.
    const isTwitterUsername = await handleIsTwitterUsername(handle);
    
    // const twitterData = headers['x-twitter-data'] && JSON.parse(headers['x-twitter-data']);
    // if (twitterData) {
    //     console.log(twitterData);
    // }
    

    // Simulate taken handle.
    const response: HandleAvailableResponseGETBody = await new Promise((res, rej) => {
        setTimeout(() => {
            if ('onchain' === handle) {
                res({
                    available: false,
                    link: 'https://cardanoscan.com',
                    message: 'Handle already owned!'
                });
            } else {
                res({
                    available: true,
                    message: 'Available!',
                    link: null
                });
            }
        }, 400)
    });

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext, callback: HandlerCallback) => {
    switch(event.httpMethod) {
        case 'GET':
            return await _handle_GET(event, context, callback);
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'Not support method.'
        })
    }
};

export { handler };