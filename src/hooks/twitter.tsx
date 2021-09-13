import React, { useContext } from "react";
import { AdditionalUserInfo } from "firebase/auth";

import { HandleMintContext } from "../context/handleSearch";

export const useTwitter = (): [() => Promise<void>] => {
  const { setTwitter, setHandle } = useContext(HandleMintContext);

  const handleConnectTwitter = async () => {
    await import("../lib/firebase").then(({ app }) => app);

    const {
      getAuth,
      getAdditionalUserInfo,
      signInWithPopup,
      TwitterAuthProvider
    } = await import("firebase/auth");

    const provider = new TwitterAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider)
      .then((result) => {
        const credentials = TwitterAuthProvider.credentialFromResult(result);
        const user: AdditionalUserInfo = getAdditionalUserInfo(result);
        setTwitter({
            user,
            credentials
        });
        setHandle(user.username);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return [handleConnectTwitter];
};
