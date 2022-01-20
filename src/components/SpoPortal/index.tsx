import React, { useContext, useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import { SessionResponseBody } from "../../../netlify/functions/session";
import { HandleMintContext } from "../../context/mint";
import {
  getAccessTokenFromCookie,
  getAllCurrentSPOSessionData,
  getSessionTokenFromCookie,
} from "../../lib/helpers/session";
import { useAccessOpen } from "../../lib/hooks/access";
import { usePrimeMintingContext } from "../../lib/hooks/primeMintingContext";
import { HandleSession } from "../HandleSession";
import { Loader } from "../Loader";
import NFTPreview from "../NFTPreview";
import { Closed } from "./Closed";
import { SpoEnterForm } from "./Form";
import { NoSessions } from "./NoSessions";
import { TabNavigation } from "./TabNavigation";

export const SpoPortalPage = (): JSX.Element => {
  const { primed, betaState, stateLoading, handle, currentIndex } =
    useContext(HandleMintContext);
  const [accessOpen, setAccessOpen] = useAccessOpen();

  const [paymentSessions, setPaymentSessions] = useState<
    (false | SessionResponseBody)[]
  >([]);

  useEffect(() => {
    setPaymentSessions(getAllCurrentSPOSessionData());
  }, [currentIndex, setPaymentSessions]);

  console.log(paymentSessions);

  usePrimeMintingContext();

  const currentAccess = useMemo(
    () => getAccessTokenFromCookie(),
    [currentIndex]
  );

  const currentSession = useMemo(
    () =>
      currentIndex > 0
        ? (getSessionTokenFromCookie(currentIndex) as SessionResponseBody)
        : null,
    [currentIndex]
  );

  const refreshPaymentSessions = () => {
    setPaymentSessions(getAllCurrentSPOSessionData());
  };

  const spoPageEnabled = betaState?.spoPageEnabled ?? false;

  if (stateLoading) {
    return (
      <div className="flex">
        <Loader />
      </div>
    );
  }

  return (
    <section id="top" className="max-w-5xl mx-auto">
      {spoPageEnabled && (
        <>
          {currentAccess && (
            <Countdown
              onComplete={() => setAccessOpen(false)}
              date={new Date(currentAccess.data.exp * 1000)}
              renderer={({ formatted }) => {
                return (
                  <p className="text-white text-right">
                    Access Expires: {formatted.minutes}:{formatted.seconds}
                  </p>
                );
              }}
            />
          )}
          <TabNavigation
            paymentSessions={paymentSessions}
            updatePaymentSessions={refreshPaymentSessions}
          />
          <div
            className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-start p-4 lg:p-8 mb-16"
            style={{ minHeight: "10vh" }}
          >
            {!accessOpen && <SpoEnterForm setAccessOpen={setAccessOpen} />}
            {/*
        At this point, we have already searched and verified the pool name exists
        Next step is to display the wallet address and the NFT preview
    */}
            {accessOpen && (
              <>
                <div className="col-span-12 lg:col-span-6 relative z-10">
                  <div className="p-8">
                    {currentIndex === 0 ? (
                      <NoSessions />
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
                    isSpo={true}
                  />
                </div>
              </>
            )}
          </div>
          {accessOpen && betaState && (
            <p className="text-white mt-4 text-center">
              Current Chain Load: {`${(betaState.chainLoad * 100).toFixed(2)}%`}
            </p>
          )}
        </>
      )}
      {!spoPageEnabled && <Closed />}
    </section>
  );
};
