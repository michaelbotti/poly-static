import React, { useState, useContext } from "react";

import { AppContext } from '../context/app';
import { HandleSearchForm } from "../components/HandleSearch";
import WalletButton from '../components/WalletButton';
import { HandleMintContext, defaultState } from "../context/handleSearch";
import { HandleAvailableResponseGETBody } from "../functions/handle";
import NFTPreview from "../components/NFTPreview";
import SEO from "../components/seo";
import { Link } from "gatsby";

function MintPage() {
  const { isConnected } = useContext(AppContext);
  const [handle, setHandle] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [handleResponse, setHandleResponse] = useState<HandleAvailableResponseGETBody|null>(null);

  return (
    <HandleMintContext.Provider value={{
      ...defaultState,
      fetching,
      setFetching,
      handle,
      setHandle,
      handleResponse,
      setHandleResponse
    }}>
      <SEO title="Home" />
      <section id="top">
        <div className="grid grid-cols-12 bg-dark-200 rounded-lg place-content-center">
          <div className="col-span-12 lg:col-span-6 relative z-10">
            <div className="p-8">
              <h2 className="font-bold text-3xl text-primary-100 mb-2">
                Securing Your Handle
              </h2>
              {isConnected ? (
                <>
                  <p className="text-lg">
                    Purchasing your own handle allows you to easily receive Cardano payments just by sharing your handle name, or by sharing your unique link.
                  </p>
                  <p className="text-lg">
                    For more information, see <Link className="text-primary-100" to={'/how-it-works'}>How it Works</Link>.
                  </p>
                  <hr className="w-12 border-dark-300 border-2 block my-8" />
                  <HandleSearchForm />
                  <p className="text-sm mt-8">
                    Once you start checking out, <strong>your session will be reserved for 10
                    minutes</strong>. DO NOT close your window, or your session will expire.
                  </p>
                </>
              ) : (
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
