import * as admin from "firebase-admin";
import { getS3 } from "./aws";

let firebaseApp: admin.app.App;
export const getFirebase = async (): Promise<admin.app.App> => {
  if (firebaseApp) {
    return firebaseApp;
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

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(credentials),
    databaseURL: 'https://ada-handle-reserve-default-rtdb.firebaseio.com/'
  }, 'adahandle-client');

  return firebaseApp;
};

export const verifyAppCheck = async (token: string): Promise<boolean> => {
  const admin = await getFirebase();
  try {
    const res = await admin.appCheck().verifyToken(token);
    return !!res;
  } catch (e) {
    return false;
  }
};

export const verifyTwitterUser = async (token: string): Promise<number | false> => {
  const admin = await getFirebase();
  try {
    const { exp } = await admin.auth().verifyIdToken(token)
    return exp;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export const getDatabase = async (): Promise<admin.database.Database> => {
  const app = await getFirebase();
  return admin.database(app);
}
