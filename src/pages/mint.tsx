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
  const { primed, handle, currentIndex, betaState } = useContext(HandleMintContext);
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
          className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-start p2 lg:p-8 mb-16"
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
                  <h2 className="w-full text-4xl font-bold text-primary-100 mb-2">Beta Launch 🎉</h2>
                  <hr className="w-12 border-dark-300 border-2 block my-8" />
                  <h3 className="text-lg uppercase mb-4">How it Works</h3>
                  <ul className="text-lg">
                    <li className="leading-normal"><p><strong><u>Enter your phone number.</u></strong> This is required for Beta launch to achieve the fairest launch possible. We DO NOT keep this data beyond your session.</p></li>
                    <li className="leading-normal"><p>20 participants will receive an access code every five minutes, good for one <span className="font-bold underline">30 minute access window</span>.</p></li>
                    <li className="leading-normal"><p>Access codes <span className="font-bold underline">will be paused if the blockchain load is above 80%</span>, ensuring timely transaction times.</p></li>
                    <li className="leading-normal"><p>Within that window, you can mint up to <span className="font-bold underline">3 individual Handles at a time (9 total)</span> before having to re-enter the queue.</p></li>
                  </ul>
                </div>
                <div className="col-span-6">
                  {betaState?.totalHandles < 15000 && <HandleQueue />}
                  {betaState?.totalHandles >= 15000 && (
                    <div className="flex items-center justify-between mb-8 lg:mb-12">
                      <div className="w-1/2 text-center">
                        <h4 className="text-white text-center font-bold">
                          Sold Out!
                        </h4>
                      </div>
                    </div>
                  )}
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
