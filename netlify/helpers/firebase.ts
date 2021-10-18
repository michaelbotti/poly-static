import admin from "firebase-admin";
import { getS3 } from "./aws";

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

export const getDatabase = async (): Promise<admin.database.Database> => {
  return admin.database(firebase);
}
