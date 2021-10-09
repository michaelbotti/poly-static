import React, { useContext } from "react";

import { HandleMintContext } from "../context/mint";
import { usePrimeMintingContext } from "../lib/helpers/context";
import { useAccessOpen } from "../lib/hooks/access";

import SEO from "../components/seo";
import { HandleSearchReserveFlow } from "../components/HandleSearch";
import { Loader } from "../components/Loader";
import NFTPreview from "../components/NFTPreview";
import { HandleQueue } from "../components/HandleQueue";

function MintPage() {
  const { primed, handle } = useContext(HandleMintContext);
  const [accessOpen] = useAccessOpen();

  usePrimeMintingContext();

  return (
    <>
      <SEO title="Mint" />
      <section id="top">
        <div
          className="grid grid-cols-12 gap-16 bg-dark-200 rounded-lg place-content-start p-8"
          style={{ minHeight: "60vh" }}
          >
            {null === accessOpen && (
              <div className="col-span-12 relative z-10">
                <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
                  <p className="w-full text-center">Fetching details...</p>
                  <Loader />
                </div>
              </div>
            )}
            {false === accessOpen && (
              <>
                <div className="col-span-6 relative z-10">
                  <h4 className="w-full text-4xl font-bold text-primary-100 mb-4">🎉 Beta Launch! 🎉</h4>
                  <div className="text-lg">
                    <p>To achieve the fairest launch possible, we are <strong>requiring one-time phone authentication</strong> during the beta phase ONLY.</p>
                    <p>We <strong>do not keep any data</strong>, your details are <strong>completely private</strong>, and our code <strong>is completely <a href="https://github.com/adahandle" target="_blank" className="text-primary-100">open-source</a> and viewable by the public</strong>.</p>
                    <hr className="w-12 border-dark-300 border-2 block my-8" />
                  </div>
                  <p>After entering the queue: when it's your turn, you'll get a one-time 6 digit passcode.</p>
                  <p><strong>This passcode is good for 30 minutes!</strong> After that, it will expire and you'll need to enter the queue again.</p>
                  <p>If you want more information explaining the process, read our <a href="#" className="text-primary-100">detailed Medium post &rarr;</a>.</p>
                </div>
                <div className="col-span-6">
                  <h5 className="text-2xl text-white text-center mb-4">Get Started</h5>
                  <HandleQueue />
                </div>
              </>
            )}
            {accessOpen && (
              <>
                <div className="col-span-12 lg:col-span-6 relative z-10">
                  {primed ? (
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
