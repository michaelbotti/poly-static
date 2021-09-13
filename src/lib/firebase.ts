import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

export const config: FirebaseOptions = {
    apiKey: 'AIzaSyAjLfhecwnZJyl-lv8FdXasQZGmYEEJ-wc',
    appId: '1:995478242710:web:7b01129b47c6e82e1e49b7',
    authDomain: 'ada-handle-reserve.firebaseapp.com',
    messagingSenderId: '995478242710',
    projectId: 'ada-handle-reserve',
    storageBucket: 'ada-handle-reserve.appspot.com',
    databaseURL: 'https://ada-handle-reserve-default-rtdb.firebaseio.com/'
}

export const app = initializeApp(config);

export const useDatabase = () => getFirestore(app);