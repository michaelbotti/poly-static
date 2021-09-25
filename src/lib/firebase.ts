import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check';
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app';
import { ref, getDatabase as getFirebaseDatabase, Database } from 'firebase/database';
import { RECAPTCHA_SITE_KEY } from './constants';

export const config: FirebaseOptions = {
    apiKey: "AIzaSyAjLfhecwnZJyl-lv8FdXasQZGmYEEJ-wc",
    authDomain: "ada-handle-reserve.firebaseapp.com",
    databaseURL: "https://ada-handle-reserve-default-rtdb.firebaseio.com",
    projectId: "ada-handle-reserve",
    storageBucket: "ada-handle-reserve.appspot.com",
    messagingSenderId: "995478242710",
    appId: "1:995478242710:web:7b01129b47c6e82e1e49b7"
}

let firebase: FirebaseApp;
export const getFirebase = () => {
  if (firebase) {
    return firebase;
  }

  firebase = initializeApp(config);
  return firebase;
}

let database: Database;
export const getDatabase = () => {
  if (database) {
    return database;
  }

  const app = getFirebase();
  database = getFirebaseDatabase(app);
  return database;
}

export const getActiveSessionsRef = () => {
  const database = getDatabase();
  const dbRef = ref(database, '/activeSessions');
  return dbRef;
}

export const getReservedHandlesRef = () => {
  const database = getDatabase();
  const dbRef = ref(database, '/reservedHandles');
  return dbRef;
}

let token: string;
export const requestToken = async (): Promise<string> => {
  if (token) {
    return token;
  }

  const app = getFirebase();
  const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true
  });

  const { token: newToken } = await getToken(appCheck, false);
  token = newToken;
  return token;
}
