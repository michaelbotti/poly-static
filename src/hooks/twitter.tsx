import React, { useContext } from "react";
import { AdditionalUserInfo } from "firebase/auth";
import { getDatabase, onValue } from 'firebase/database';

import { getFirebase } from '../lib/firebase';
import { ref, child, get } from 'firebase/database';
import { HandleMintContext } from "../context/handleSearch";

export const useTwitter = (): [
  () => Promise<boolean>,
  () => Promise<string[]>
] => {
  const { setTwitter, handle } = useContext(HandleMintContext);
  
  const checkHandleAgainstUser = async () => {
    const {
      getAuth,
      getAdditionalUserInfo,
      signInWithPopup,
      signOut,
      TwitterAuthProvider
    } = await import("firebase/auth");

    const provider = new TwitterAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider)
      .then(async (result) => {
        const credentials = TwitterAuthProvider.credentialFromResult(result);
        const user: AdditionalUserInfo = getAdditionalUserInfo(result);

        // If we match, proceed.
        if (user.username.toLowerCase() === handle.toLocaleLowerCase()) {
          setTwitter({
            user,
            credentials
          });
          return true;
        }

        await signOut(auth);
        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  const getTwitterUsernames = async () => {
    const db = getDatabase(getFirebase());
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, '/reservedTwitterUsernames'));
    return snapshot.val().map(username => username.toLowerCase()) || [];
  }

  return [checkHandleAgainstUser, getTwitterUsernames];
};