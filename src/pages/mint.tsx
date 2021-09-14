import React, { useState, useContext, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import loadable from '@loadable/component';

import { getFirebase } from "../lib/firebase";
import { AppContext } from '../context/app';
import { HandleMintContext, defaultState, TwitterProfileType } from "../context/handleSearch";
import { HandleResponseBody } from "../functions/handle";
import { useTwitter } from '../hooks/twitter';

import WalletButton from '../components/WalletButton';
import NFTPreview from "../components/NFTPreview";
import SEO from "../components/seo";
import { HandleSearchReserveFlow } from "../components/HandleSearch";

const LazyHandleSearchPurchaseFlow = loadable(
  () => import('../components/HandleSearch/HandleSearchPurchaseFlow'),
  {
      fallback: <h4>Intializing...</h4>
  }
);

function MintPage() {
  const { isConnected } = useContext(AppContext);
  const [handle, setHandle] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [handleResponse, setHandleResponse] = useState<HandleResponseBody|null>(null);
  const [twitter, setTwitter] = useState<TwitterProfileType>(null);
  const [currentSessions, setCurrentSessions] = useState<string[]>([]);
  const [reservedTwitterUsernames, setReservedTwitterUsernames] = useState<string[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [handleTwitterConnect, getTwitterUsernames] = useTwitter();

  useEffect(() => {
    (async () => {
      const app = getFirebase();
      initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider('6Ld0QUkcAAAAAN-_KvCv8R_qke8OYxotNJzIg2RP'),
          isTokenAutoRefreshEnabled: true
      });

      // Get reserved Twitter names.
      const names = await getTwitterUsernames();
      setReservedTwitterUsernames(names);
      
      // Setup a session watcher.
      const db = getDatabase(getFirebase());
      const sessionRef = ref(db, '/currentSessions');
      onValue(sessionRef, (snapshot) => {
        const sessions = snapshot.val();
        setCurrentSessions(sessions);
      });
    })();
  }, []);

  return (
    <HandleMintContext.Provider value={{
      ...defaultState,
      fetching,
      handle,
      handleResponse,
      twitter,
      reservedTwitterUsernames,
      isPurchasing,
      currentSessions,
      setFetching,
      setHandle,
      setHandleResponse,
      setTwitter,
      setIsPurchasing,
      setCurrentSessions
    }}>
      <SEO title="Home" />
      <section id="top">
        <div className="grid grid-cols-12 bg-dark-200 rounded-lg place-content-center">
          <div className="col-span-12 lg:col-span-6 relative z-10">
            <div className="p-8">
              {isConnected && !isPurchasing && <HandleSearchReserveFlow />}
              {isConnected && isPurchasing && <LazyHandleSearchPurchaseFlow />}
              {!isConnected && (
                <>
                  <p className="mt-2 text-lg">In order to mint a new handle, you'll need to connect your Nami wallet.</p>
                  <WalletButton />
                </>
              )}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 py-8">
            <NFTPreview handle={handle} />
          </div>
        </div>
      </section>
    </HandleMintContext.Provider>
  );
}

export default MintPage;
