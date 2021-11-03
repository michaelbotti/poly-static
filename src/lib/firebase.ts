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

export const app = initializeApp(config);
