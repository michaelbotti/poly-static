import React, { useState, useContext, useEffect } from "react";

import { AppContext } from '../context/app';
import { HandleMintContext, defaultState, TwitterProfileType, ReservedHandlesType, ActiveSessionType } from "../context/handleSearch";
import { HandleResponseBody } from '../lib/helpers/search';

import { Loader } from '../components/Loader';
import WalletButton from '../components/WalletButton';
import NFTPreview from "../components/NFTPreview";
import SEO from "../components/seo";
import { HandleSearchReserveFlow, HandleSearchPurchaseFlow } from "../components/HandleSearch";
import { requestToken } from "../lib/firebase";
import { HEADER_APPCHECK } from "../lib/constants";

function MintPage() {
  const { isConnected, setErrors } = useContext(AppContext);
  const [loaded, setLoaded] = useState<boolean>(false);

  // State handlers for context.
  const [handle, setHandle] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [handleResponse, setHandleResponse] = useState<HandleResponseBody|null>(null);
  const [twitterToken, setTwitterToken] = useState<TwitterProfileType|null>(null);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [reservedHandles, setReservedHandles] = useState<ReservedHandlesType|null>(null);

  // Pre-fetch reserved handles to ensure warm function.
  useEffect(() => {
    (async () => {
      const token = await requestToken();
      const headers = {
        [HEADER_APPCHECK]: token
      }

      await (await fetch('/.netlify/functions/clean', { headers })).json();
      const reservedData = await (await fetch('/.netlify/functions/reservedHandles', { headers })).json();
      if (!localStorage.getItem('ADAHANDLE_IP')) {
        const { ip } = await (await fetch('/.netlify/functions/ip', { headers })).json();
        localStorage.setItem('ADAHANDLE_IP', ip);
      }

      console.log('test');

      setReservedHandles(reservedData);
      setLoaded(true);
    })();
  }, []);

  return (
    <HandleMintContext.Provider value={{
      ...defaultState,
      fetching,
      handle,
      handleResponse,
      twitterToken,
      isPurchasing,
      reservedHandles,
      setFetching,
      setHandle,
      setHandleResponse,
      setTwitterToken,
      setIsPurchasing,
      setReservedHandles
    }}>
      <SEO title="Home" />
      <section id="top">
        <div className="grid grid-cols-12 bg-dark-200 rounded-lg place-content-center">
          <div className="col-span-12 lg:col-span-6 relative z-10">
            {loaded
              ? (
                <div className="p-8">
                  {isConnected && !isPurchasing && <HandleSearchReserveFlow />}
                  {isConnected && isPurchasing && <HandleSearchPurchaseFlow />}
                  {!isConnected && loaded && (
                    <>
                      <p className="mt-2 text-lg">In order to mint a new handle, you'll need to connect your Nami wallet.</p>
                      <WalletButton />
                    </>
                  )}
                </div>
              ) : (
                <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
                  <p className="w-full text-center">Fetching bytes...</p>
                  <Loader />
                </div>
              )
            }
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
