import { initializeAppCheck, ReCaptchaV3Provider, getToken } from '@firebase/app-check';
import { initializeApp, FirebaseOptions } from 'firebase/app';

export const config: FirebaseOptions = {
    apiKey: "AIzaSyAjLfhecwnZJyl-lv8FdXasQZGmYEEJ-wc",
    authDomain: "ada-handle-reserve.firebaseapp.com",
    databaseURL: "https://ada-handle-reserve-default-rtdb.firebaseio.com",
    projectId: "ada-handle-reserve",
    storageBucket: "ada-handle-reserve.appspot.com",
    messagingSenderId: "995478242710",
    appId: "1:995478242710:web:7b01129b47c6e82e1e49b7"
}

const app = initializeApp(config);

export const requestToken = async (): Promise<string> => {
    const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider('6Ld0QUkcAAAAAN-_KvCv8R_qke8OYxotNJzIg2RP'),
        isTokenAutoRefreshEnabled: true
    });
    
    const { token } = await getToken(appCheck, false);
    return token;
}