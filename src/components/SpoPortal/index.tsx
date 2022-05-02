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
import { VerifyForm } from "./VerifyForm";

export const SpoPortalPage = (): JSX.Element => {
  const {
    stateData,
    stateLoading,
    handle,
    handleCost,
    currentIndex,
    setCurrentIndex,
    currentSPOAccess,
    setCurrentSPOAccess,
    poolVerified,
    poolChallenged,
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

  // TODO: Fix current index. If you refresh, it will always be 0.

  useEffect(() => {
    setPaymentSessions(getAllCurrentSPOSessionData());

    if (currentIndex > 0) {
      setCurrentSession(getSPOSessionTokenFromCookie(currentIndex));
    }
  }, [currentIndex]);

  const refreshPaymentSessions = useCallback(() => {
    setPaymentSessions(getAllCurrentSPOSessionData());
  }, [setPaymentSessions, getAllCurrentSPOSessionData]);

  console.log("currentIndex", currentIndex);
  console.log("currentSession", currentSession);

  const renderContent = () => {
    if (!currentSPOAccess) {
      return <EnterForm />;
    }

    if (!currentSession) {
      return <VerifyForm />;
    }

    return (
      <>
        <div className="col-span-12 lg:col-span-6 relative z-10">
          <div className="p-8">
            <HandleSession sessionData={currentSession} />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 py-8">
          <NFTPreview
            handle={currentSession.data.handle}
            handleCost={currentSession.data.handle}
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
