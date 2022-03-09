import admin from "firebase-admin";

import { ActiveSessionType, ReservedHandlesType } from "../../src/context/mint";
import { getS3 } from "./aws";
import { buildCollectionNameWithSuffix } from "./util";
import { StateData } from '../functions/state';

interface StakePool {
  id: string; // pool id e.g. pool1lvsa...
  ticker: string;
  stakeKey: string;
  ownerHashes: string[];
}

interface RefundableSession {
  amount: number;
  handle: string;
}

let firebase: admin.app.App;
export const initFirebase = async (): Promise<admin.app.App> => {
  if (firebase) {
    return firebase;
  }

  const s3 = getS3();
  const res = await s3
    .getObject({
      Bucket: process.env.MY_AWS_BUCKET as string,
      Key: process.env.MY_AWS_FIREBASE_KEY as string,
    })
    .promise();

  const credentials: admin.ServiceAccount | null = res?.Body
    ? JSON.parse(res.Body.toString("utf-8"))
    : null;
  if (!credentials) {
    throw new Error("Firebase did not successfully initialize.");
  }

  firebase = admin.initializeApp({
    credential: admin.credential.cert(credentials),
    databaseURL: 'https://ada-handle-reserve-default-rtdb.firebaseio.com/'
  });

  return firebase;
};

export const verifyTwitterUser = async (token: string): Promise<number | false> => {
  try {
    const { exp } = await admin.auth(firebase).verifyIdToken(token)
    return exp;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export const getReservedHandles = async (): Promise<ReservedHandlesType | false> => {
  return firebase
    .firestore()
    .collection("reservedHandles")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return false;
      }

      const handles = snapshot?.docs?.map(doc => doc?.data() as ReservedHandlesType);
      if (handles.length === 0) {
        return false;
      }

      return handles[0];
    });
}

export const getActiveSessionsByEmail = async (emailAddress: string): Promise<ActiveSessionType[]> => {
  return firebase
    .firestore()
    .collection(buildCollectionNameWithSuffix("/activeSessions"))
    .where("emailAddress", "==", emailAddress)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return [];
      }

      const sessions = snapshot?.docs?.map(doc => doc?.data() as ActiveSessionType);
      return sessions;
    });
}

export const getActiveSessionByHandle = async (handle: string): Promise<ActiveSessionType | null> => {
  return firebase
    .firestore()
    .collection(buildCollectionNameWithSuffix("/activeSessions"))
    .where("handle", "==", handle)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return null;
      }

      return snapshot?.docs[0]?.data() as ActiveSessionType;
    });
}

export const getPaidSessionByHandle = async (handle: string): Promise<ActiveSessionType | null> => {
  return firebase
    .firestore()
    .collection(buildCollectionNameWithSuffix("/activeSessions"))
    .where("status", "==", "paid")
    .where("handle", "==", handle).limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return null;
      }

      return snapshot?.docs[0]?.data() as ActiveSessionType;
    });
}

export const getRefundedSessionByHandle = async (handle: string): Promise<RefundableSession | null> => {
  return firebase
    .firestore()
    .collection(buildCollectionNameWithSuffix("/activeSessions"))
    .where("status", "==", "refundable")
    .where("handle", "==", handle).limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return null;
      }

      return snapshot?.docs[0]?.data() as RefundableSession;
    });
}

export const getCachedState = async (): Promise<StateData | null> => {
  const stateDoc = await admin
    .firestore()
    .collection(buildCollectionNameWithSuffix("/stateData"))
    .doc('state')
    .get();
  const settingsDoc = await admin
    .firestore()
    .collection(buildCollectionNameWithSuffix("/stateData"))
    .doc('settings')
    .get();

  const { chainLoad, totalHandles, accessQueueSize, handlePrices } = stateDoc.data() as StateData;
  const { spoPageEnabled, accessWindowTimeoutMinutes, paymentWindowTimeoutMinutes, dynamicPricingEnabled, mintingPageEnabled } = settingsDoc.data() as StateData;

  const state = {
    chainLoad,
    totalHandles,
    spoPageEnabled,
    accessWindowTimeoutMinutes,
    paymentWindowTimeoutMinutes,
    accessQueueSize,
    handlePrices,
    dynamicPricingEnabled,
    mintingPageEnabled
  } as StateData;
  if (!state) {
    return null;
  }

  return state;
}

export const getStakePoolsByTicker = async (ticker: string): Promise<StakePool[]> => {
  const snapshot = await admin
    .firestore()
    .collection(buildCollectionNameWithSuffix("/stakePools"))
    .where('ticker', '==', ticker)
    .get();


  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => doc.data() as StakePool);
}
