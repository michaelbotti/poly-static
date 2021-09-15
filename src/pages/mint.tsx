import React, { useState, useContext } from "react";
import loadable from '@loadable/component';

import { AppContext } from '../context/app';
import { HandleMintContext, defaultState, TwitterProfileType } from "../context/handleSearch";
import { HandleResponseBody } from "../functions/handle";

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
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);

  return (
    <HandleMintContext.Provider value={{
      ...defaultState,
      fetching,
      handle,
      handleResponse,
      twitter,
      isPurchasing,
      setFetching,
      setHandle,
      setHandleResponse,
      setTwitter,
      setIsPurchasing
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
