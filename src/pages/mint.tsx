import React, { useContext } from "react";

import { HandleMintContext } from "../context/mint";
import { usePrimeMintingContext } from "../lib/hooks/primeMintingContext";
import { useAccessOpen } from "../lib/hooks/access";

import SEO from "../components/seo";
import { HandleSearchReserveFlow } from "../components/HandleSearch";
import { Loader } from "../components/Loader";
import NFTPreview from "../components/NFTPreview";
import { HandleQueue } from "../components/HandleQueue";
import { getAllCurrentSessionData, getSessionTokenFromCookie } from "../lib/helpers/session";
import { HandleSession } from "../components/HandleSession";
import { HandleNavigation } from "../components/HandleNavigation";
import { SessionResponseBody } from "../../netlify/functions/session";

function MintPage() {
  const { primed, handle, currentIndex } = useContext(HandleMintContext);
  const [accessOpen] = useAccessOpen();

  usePrimeMintingContext();

  const currentSession = currentIndex > 0 ? getSessionTokenFromCookie(currentIndex) as SessionResponseBody : null;
  const paymentSessions = getAllCurrentSessionData();

  return (
    <>
      <SEO title="Mint" />
      <section id="top" className="max-w-5xl mx-auto">
        <HandleNavigation paymentSessions={paymentSessions} />
        <div
          className="grid grid-cols-12 gap-4 bg-dark-200 rounded-lg rounded-tl-none place-content-start p2 lg:p-8 mb-16"
          style={{ minHeight: "60vh" }}
          >
            {null === accessOpen && (
              <div className="col-span-12 md:col-span-6 relative z-10">
                <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
                  <p className="w-full text-center">Fetching details...</p>
                  <Loader />
                </div>
              </div>
            )}
            {false === accessOpen && (
              <>
                <div className="col-span-12 md:col-span-6 relative z-10">
                  <h2 className="w-full text-4xl font-bold text-primary-100 mb-4">🎉 Beta Launch! 🎉</h2>
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
                  <h3 className="text-2xl text-white text-center mb-4">Get Started</h3>
                  <HandleQueue />
                </div>
              </>
            )}
            {accessOpen && (
              <>
                <div className="col-span-12 lg:col-span-6 relative z-10">
                  {primed && (
                    <div className="p-8">
                      {currentIndex === 0
                        ? <HandleSearchReserveFlow />
                        : <HandleSession sessionData={currentSession} />}
                    </div>
                  )}

                  {!primed && (
                    <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
                      <p className="w-full text-center">Setting up...</p>
                      <Loader />
                    </div>
                  )}
                </div>
                <div className="col-span-12 lg:col-span-6 py-8">
                  <NFTPreview handle={currentIndex === 0 ? handle : currentSession.data.handle} />
                </div>
              </>
            )}
        </div>
      </section>
    </>
  );
}

export default MintPage;
