import "./src/styles/global.css";
import { RECAPTCHA_SITE_KEY } from "./src/lib/constants";
import { initializeApp } from "@firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "@firebase/app-check";

const config = {
  apiKey: "AIzaSyAjLfhecwnZJyl-lv8FdXasQZGmYEEJ-wc",
  authDomain: "ada-handle-reserve.firebaseapp.com",
  databaseURL: "https://ada-handle-reserve-default-rtdb.firebaseio.com",
  projectId: "ada-handle-reserve",
  storageBucket: "ada-handle-reserve.appspot.com",
  messagingSenderId: "995478242710",
  appId: "1:995478242710:web:7b01129b47c6e82e1e49b7"
}

const app = initializeApp(config);
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: false
});
