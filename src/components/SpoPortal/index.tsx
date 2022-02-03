import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";

import Countdown from "react-countdown";
import { SessionResponseBody } from "../../../netlify/functions/session";
import { HandleMintContext } from "../../context/mint";
import {
  getAccessTokenFromCookie,
  getAllCurrentSPOSessionData,
  getSessionTokenFromCookie,
} from "../../lib/helpers/session";
import { useAccessOpen } from "../../lib/hooks/access";
import { HandleSession } from "../HandleSession";
import { Loader } from "../Loader";
import NFTPreview from "../NFTPreview";
import { Closed } from "./Closed";
import { EnterForm } from "./EnterForm";
import { HandleSearch } from "./HandleSearch";
import { TabNavigation } from "./TabNavigation";
import Button from "../button";
import { COOKIE_ACCESS_KEY, COOKIE_SESSION_PREFIX } from "../../lib/constants";
import { VerifyResponseBody } from "../../../netlify/functions/verify";

// TODO: Test with an SPO with the correct amount but not the owner - DONE!
// TODO: Test with an SPO that is the owner

export const SpoPortalPage = (): JSX.Element => {
  const {
    primed,
    betaState,
    stateLoading,
    handle,
    currentIndex,
    setCurrentIndex,
  } = useContext(HandleMintContext);

  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [currentAccess, setCurrentAccess] = useState<
    false | VerifyResponseBody
  >(false);
  const [paymentSessions, setPaymentSessions] = useState<
    (false | SessionResponseBody)[]
  >([]);

  useEffect(() => {
    setPaymentSessions(getAllCurrentSPOSessionData());
  }, [currentIndex, setPaymentSessions]);

  useEffect(() => {
    const access = getAccessTokenFromCookie();
    setCurrentAccess(access);
  }, [currentIndex, agreedToTerms]);

  const currentSession = useMemo(
    () =>
      currentIndex > 0
        ? (getSessionTokenFromCookie(currentIndex) as SessionResponseBody)
        : null,
    [currentIndex]
  );

  const refreshPaymentSessions = useCallback(() => {
    setPaymentSessions(getAllCurrentSPOSessionData());
  }, [setPaymentSessions, getAllCurrentSPOSessionData]);

  const renderContent = () => {
    if (!agreedToTerms) {
      return <EnterForm setAgreedToTerms={setAgreedToTerms} />;
    }

    if (currentIndex === 0 && paymentSessions[0]) {
      return (
        <div className="col-span-12 relative z-10">
          <div className="p-8">
            <h2 className="font-bold text-3xl text-primary-100 mb-2">
              You have secured a your handle!
            </h2>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <p>
              We're currently only allowing 1 handle per sessions. Once we
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
            {currentIndex === 0 ? (
              <HandleSearch setAgreedToTerms={setAgreedToTerms} />
            ) : (
              <HandleSession sessionData={currentSession} />
            )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 py-8">
          <NFTPreview
            handle={currentIndex === 0 ? handle : currentSession.data.handle}
            isSpo={true}
          />
        </div>
      </>
    );
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
              onComplete={() => {
                setAgreedToTerms(false);
                setCurrentIndex(0);
                // delete session cookie
                Cookies.remove(`${COOKIE_SESSION_PREFIX}_1`);
                // delete access cookie
                Cookies.remove(COOKIE_ACCESS_KEY);
              }}
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
            agreedToTerms={agreedToTerms}
          />
          <div
            className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-start p-4 lg:p-8 mb-16"
            style={{ minHeight: "10vh" }}
          >
            {renderContent()}
          </div>
          {agreedToTerms && betaState && (
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
