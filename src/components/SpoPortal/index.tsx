import React, { useCallback, useContext, useEffect, useState } from "react";

import Cookies from "js-cookie";

import Countdown from "react-countdown";
import { SessionResponseBody } from "../../../netlify/functions/session";
import { HandleMintContext } from "../../context/mint";
import {
  getAllCurrentSPOSessionData,
  getSPOSessionTokenFromCookie,
} from "../../lib/helpers/session";
import { HandleSession } from "../HandleSession";
import { Loader } from "../Loader";
import NFTPreview from "../NFTPreview";
import { Closed } from "./Closed";
import { EnterForm } from "./EnterForm";
import { HandleSearch } from "./HandleSearch";
import { TabNavigation } from "./TabNavigation";
import {
  SPO_COOKIE_ACCESS_KEY,
  SPO_COOKIE_SESSION_PREFIX,
} from "../../lib/constants";

export const SpoPortalPage = (): JSX.Element => {
  const {
    stateData,
    stateLoading,
    handle,
    currentIndex,
    setCurrentIndex,
    currentSPOAccess,
    setCurrentSPOAccess,
  } = useContext(HandleMintContext);
  const [currentSession, setCurrentSession] = useState<
    false | SessionResponseBody
  >(false);
  const [paymentSessions, setPaymentSessions] = useState<
    (false | SessionResponseBody)[]
  >([]);

  const clearSession = () => {
    setCurrentIndex(0);
    setCurrentSPOAccess(false);
    // delete session cookie
    Cookies.remove(`${SPO_COOKIE_SESSION_PREFIX}_1`);
    // delete access cookie
    Cookies.remove(SPO_COOKIE_ACCESS_KEY);
  };

  useEffect(() => {
    setPaymentSessions(getAllCurrentSPOSessionData());

    if (currentIndex > 0) {
      setCurrentSession(getSPOSessionTokenFromCookie(currentIndex));
    }
  }, [currentIndex]);

  const refreshPaymentSessions = useCallback(() => {
    setPaymentSessions(getAllCurrentSPOSessionData());
  }, [setPaymentSessions, getAllCurrentSPOSessionData]);

  const renderContent = () => {
    if (!currentSPOAccess) {
      return <EnterForm />;
    }

    if (currentIndex === 0 && paymentSessions[0]) {
      return (
        <div className="col-span-12 relative z-10">
          <div className="p-8">
            <h2 className="font-bold text-3xl text-primary-100 mb-2">
              You have secured a your Handle!
            </h2>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <p>
              We're currently only allowing 1 Handle per sessions. Once we
              confirm payment, you'll have the option to start a new session.
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="col-span-12 lg:col-span-6 relative z-10">
          <div className="p-8">
            {currentIndex === 0 || !currentSession ? (
              <HandleSearch />
            ) : (
              <HandleSession sessionData={currentSession} />
            )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 py-8">
          <NFTPreview
            handle={
              currentIndex === 0
                ? handle
                : currentSession && currentSession.data.handle
            }
            isSpo={true}
          />
        </div>
      </>
    );
  };

  if (stateLoading || !stateData) {
    return (
      <div className="flex">
        <Loader />
      </div>
    );
  }

  const spoPageEnabled = stateData.spoPageEnabled ?? false;

  return (
    <section id="top" className="max-w-5xl mx-auto">
      {spoPageEnabled && (
        <>
          {currentSPOAccess && (
            <Countdown
              onComplete={clearSession}
              date={new Date(currentSPOAccess.data.exp * 1000)}
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
            {renderContent()}
          </div>
          {stateData && (
            <p className="text-white mt-4 text-center">
              Current Chain Load: {`${(stateData.chainLoad * 100).toFixed(2)}%`}
            </p>
          )}
        </>
      )}
      {!spoPageEnabled && <Closed />}
    </section>
  );
};
