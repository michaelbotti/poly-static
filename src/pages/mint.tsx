import React, { useContext, useEffect, useState } from "react";

import { HandleMintContext } from "../context/mint";
import { useAccessOpen } from "../lib/hooks/access";

import SEO from "../components/seo";
import { HandleSearchReserveFlow } from "../components/HandleSearch";
import { Loader } from "../components/Loader";
import NFTPreview from "../components/NFTPreview";
import {
  getAllCurrentSessionData,
  getSessionTokenFromCookie,
} from "../lib/helpers/session";
import { HandleSession } from "../components/HandleSession";
import { HandleNavigation } from "../components/HandleNavigation";
import { SessionResponseBody } from "../../netlify/functions/session";
import Countdown from "react-countdown";
import Cookies from "js-cookie";
import { COOKIE_ACCESS_KEY, COOKIE_SESSION_PREFIX } from "../lib/constants";
import { HandleAcceptTerms } from "../components/HandleAcceptTerms";
import { MintingClosed } from "../components/MintingClosed";

function MintPage() {
  const {
    handle,
    handleCost,
    currentIndex,
    stateData,
    stateLoading,
    currentAccess,
    handleResponse,
    setCurrentIndex,
    setCurrentAccess,
    passwordAllowed,
  } = useContext(HandleMintContext);

  const clearSession = () => {
    setCurrentIndex(0);
    setCurrentAccess(false);
    // delete session cookie
    Cookies.remove(`${COOKIE_SESSION_PREFIX}_1`);
    // delete access cookie
    Cookies.remove(COOKIE_ACCESS_KEY);
  };

  useEffect(() => {
    if (!currentAccess) {
      return;
    }

    if (currentAccess?.data?.isSPO) {
      clearSession();
    }
  }, [currentAccess]);

  const [paymentSessions, setPaymentSessions] =
    useState<(false | SessionResponseBody)[]>();
  const [accessOpen, setAccessOpen] = useAccessOpen();

  useEffect(() => {
    setPaymentSessions(getAllCurrentSessionData());
  }, [currentIndex, setPaymentSessions]);

  const currentSession =
    currentIndex > 0
      ? (getSessionTokenFromCookie(currentIndex) as SessionResponseBody)
      : null;

  const refreshPaymentSessions = () => {
    setPaymentSessions(getAllCurrentSessionData());
  };

  if (stateLoading || !stateData) {
    return (
      <>
        <SEO title="Mint" />
        <section id="top" className="max-w-5xl mx-auto flex">
          <Loader />
        </section>
      </>
    );
  }

  const { mintingPageEnabled } = stateData;
  if (mintingPageEnabled || passwordAllowed) {
    return (
      <>
        <SEO title="Mint" />
        <section id="top" className="max-w-5xl mx-auto">
          {currentAccess && (
            <Countdown
              onComplete={() => setAccessOpen(false)}
              date={new Date(currentAccess.data.exp * 1000)}
              renderer={({ formatted }) => {
                return (
                  <p className="text-white text-right">
                    Access Expires:{" "}
                    {formatted.hours !== "00"
                      ? `${formatted.hours}:${formatted.minutes}:${formatted.seconds}`
                      : `${formatted.minutes}:${formatted.seconds}`}
                  </p>
                );
              }}
            />
          )}
          <HandleNavigation
            paymentSessions={paymentSessions}
            updatePaymentSessions={refreshPaymentSessions}
          />
          <div
            className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-start p-4 lg:p-8"
            style={{ minHeight: "40vh" }}
          >
            {(null === accessOpen || null === stateData) && (
              <div className="col-span-12 md:col-span-6 md:col-start-4 relative z-10">
                <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
                  <p className="w-full text-center">Fetching details...</p>
                  <Loader />
                </div>
              </div>
            )}
            {accessOpen ? (
              <>
                <div className="col-span-12 lg:col-span-6 relative z-10">
                  <div className="p-8">
                    {currentIndex === 0 ? (
                      <HandleSearchReserveFlow />
                    ) : (
                      <HandleSession sessionData={currentSession} />
                    )}
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-6 py-8">
                  <NFTPreview
                    handle={
                      currentIndex === 0 ? handle : currentSession.data.handle
                    }
                    handleCost={
                      currentIndex === 0 ? handleCost : currentSession.data.cost
                    }
                    twitterOgNumber={handleResponse?.ogNumber ?? 0}
                  />
                </div>
              </>
            ) : (
              <HandleAcceptTerms accessOpen={accessOpen} />
            )}
          </div>
          {accessOpen && stateData && (
            <p className="text-white mt-4 text-center">
              Current Chain Load: {`${(stateData.chainLoad * 100).toFixed(2)}%`}
            </p>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <SEO title="Mint" />
      <MintingClosed />
    </>
  );
}

export default MintPage;
