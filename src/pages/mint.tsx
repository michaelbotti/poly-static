import React, { useContext, useState } from "react";

import { HandleMintContext } from "../context/mint";
import { usePrimeMintingContext } from "../lib/hooks/primeMintingContext";
import { useAccessOpen } from "../lib/hooks/access";

import SEO from "../components/seo";
import { HandleSearchReserveFlow } from "../components/HandleSearch";
import { Loader } from "../components/Loader";
import NFTPreview from "../components/NFTPreview";
import { HandleQueue } from "../components/HandleQueue";
import { getSessionDataCookie } from "../lib/helpers/session";
import { HandleSession } from "../components/HandleSession";

function MintPage() {
  const { primed, handle, paymentSessions } = useContext(HandleMintContext);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [accessOpen] = useAccessOpen();

  usePrimeMintingContext();

  return (
    <>
      <SEO title="Mint" />
      <section id="top" className="max-w-5xl mx-auto">
        <div className="flex justify-start place-content-center relative">
          <div className={`absolute bg-primary-100 w-8 h-8 flex items-center justify-center rounded-full -top-2 -left-2 z-10`}>
            {3 - paymentSessions.length}
          </div>
          <button
            onClick={() => setCurrentIndex(-1)}
            className={`${currentIndex !== -1 ? 'opacity-40' : ''} bg-dark-200 flex-inline items-center justify-center px-4 py-2 rounded-t-lg mr-4 relative`}
          >
            <h4 className="text-lg p-4">Mint a Handle!</h4>
          </button>
          {paymentSessions.map((session, index) => {
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index + 1)}
                className={`${index + 1 !== currentIndex ? `bg-dark-100 opacity-60` : `bg-dark-200`} flex-inline items-center justify-center px-8 lg:px-4 py-2 rounded-t-lg mr-4`}
              >
                <h4 className="hidden lg:block">${getSessionDataCookie(index + 1).data.handle}</h4>
                <h4 className="lg:hidden font-bold">{index + 1}</h4>
              </button>
            )
          })}
        </div>
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
                  {currentIndex === -1 && (
                    primed ? (
                      <div className="p-8">
                        <HandleSearchReserveFlow setActiveSession={setCurrentIndex} />
                      </div>
                    ) : (
                      <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
                        <p className="w-full text-center">Fetching bytes...</p>
                        <Loader />
                      </div>
                    )
                  )}

                  {currentIndex !== -1 && (
                    <HandleSession currentIndex={currentIndex - 1} />
                  )}
                </div>
                <div className="col-span-12 lg:col-span-6 py-8">
                  <NFTPreview handle={currentIndex === -1 ? handle : getSessionDataCookie(currentIndex).data.handle} />
                </div>
              </>
            )}
        </div>
      </section>
    </>
  );
}

export default MintPage;
