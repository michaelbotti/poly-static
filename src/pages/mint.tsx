import React, { useContext, useEffect, useState } from "react";

import SEO from "../components/seo";
import { usePrimeMintingContext, useSyncChainLoad } from "../lib/helpers/context";
import { HandleMintContext } from "../context/mint";
import { HandleSearchReserveFlow } from "../components/HandleSearch";
import { Loader } from "../components/Loader";
import NFTPreview from "../components/NFTPreview";
import Button from "../components/button";

function MintPage() {
  const { primed, chainLoad, handle } = useContext(HandleMintContext);
  const [chainLoadGood, setChainLoadGood] = useState<boolean>(null);

  useSyncChainLoad();
  usePrimeMintingContext();

  useEffect(() => {
    chainLoad && setChainLoadGood(chainLoad < .60);
  }, [chainLoad]);

  return (
    <>
      <SEO title="Mint" />
      <section id="top">
        <div
          className="grid grid-cols-12 bg-dark-200 rounded-lg place-content-center"
          style={{ minHeight: "60vh" }}
          >
          {!chainLoad && (
            <div className="col-span-12 relative z-10">
              <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
                <p className="w-full text-center">Checking congestion...</p>
                <Loader />
              </div>
            </div>
          )}
          {chainLoad && !chainLoadGood && (
            <div className="col-span-12 relative z-10">
              <div className="flex align-center justify-center h-full w-full p-8 flex-wrap">
                <h4 className="text-4xl font-bold text-center text-primary-100 mb-4">Sorry, things are a bit hectic...</h4>
                <p className="text-center text-xl w-1/2 mx-auto">
                  The Cardano blockchain is experience high-congestion. We've saved your place in
                  line. You are behind 200 more people.
                </p>
                <p className="w-full text-center">
                  <Button style="primary" internal>Get a Text Reminder</Button>
                </p>
              </div>
            </div>
          )}
          {chainLoad && chainLoadGood && (
            <>
              <div className="col-span-12 lg:col-span-6 relative z-10">
                {primed && chainLoad < .60 ? (
                  <div className="p-8">
                    <HandleSearchReserveFlow />
                  </div>
                ) : (
                  <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
                    <p className="w-full text-center">Fetching bytes...</p>
                    <Loader />
                  </div>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 py-8">
                <NFTPreview handle={handle} />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default MintPage;
