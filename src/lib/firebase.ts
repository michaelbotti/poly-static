import { initializeAppCheck, ReCaptchaV3Provider, getToken } from 'firebase/app-check';
import { initializeApp, FirebaseOptions } from 'firebase/app';
import { ref, getDatabase as getFirebaseDatabase } from 'firebase/database';
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

export const firebase = initializeApp(config);

export const getPendingSessionsRef = () => {
  const database = getFirebaseDatabase(firebase);
  const dbRef = ref(database, '/pendingSessions');
  return dbRef;
}

export const getReservedHandlesRef = () => {
  const database = getFirebaseDatabase(firebase);
  const dbRef = ref(database, '/reservedHandles');
  return dbRef;
}

export const getMintedHandlesRef = () => {
  const database = getFirebaseDatabase(firebase);
  const dbRef = ref(database, '/mintedHandles');
  return dbRef;
}

export const requestToken = async (): Promise<string> => {
  const appCheck = initializeAppCheck(firebase, {
      provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true
  });

  const { token } = await getToken(appCheck, false);
  return token;
}
