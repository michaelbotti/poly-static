import React, { useState, useEffect } from "react";
import { PageProps, navigate, Link } from "gatsby";
import Countdown from "react-countdown";

import { SessionResponseBody } from "../../netlify/functions/session";
import { PaymentData, PaymentResponseBody } from "../../netlify/functions/payment";
import { LogoMark } from "../components/logo";
import SEO from "../components/seo";
import { getAccessTokenFromCookie, getSessionDataCookie, getSessionTokenFromCookie } from "../lib/helpers/session";
import NFTPreview from "../components/NFTPreview";
import { getRarityCost, getRarityHex } from "../lib/helpers/nfts";
import { HEADER_APPCHECK, HEADER_JWT_ACCESS_TOKEN, HEADER_JWT_SESSION_TOKEN } from "../lib/constants";
import { requestToken } from "../lib/firebase";
import { Loader } from "../components/Loader";

function SessionPage({
  location,
}: PageProps<object, object, { sessionIndex: number }>) {
  const [invalid, setInvalid] = useState(false);
  const [message, setMessage] = useState<string>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sessionsData, setSessionsData] = useState<SessionResponseBody[]>([]);
  const [paymentsData, setPaymentsData] = useState<PaymentData[]>([]);
  const [invalidNotices, setInvalidNotices] = useState<string[]>(null);

  useEffect(() => {
    (async () => {
      const sessionsFromCookie = getSessionDataCookie();

      if (sessionsFromCookie.length) {
        setSessionsData(sessionsFromCookie);
        setPaymentsData(
          sessionsFromCookie.map(session => ({
            address: session.address,
            amount: 0
          }))
        )

        if (location.state?.sessionIndex) {
          setCurrentIndex(location.state.sessionIndex - 1);
        }
      } else {
        setMessage('You need to start a minting session first.');
        setInvalid(true);

        setTimeout(() => {
          navigate("/mint");
        }, 5000);

        return;
      }
    })();
  }, []);

  useEffect(() => {
    const checkPayments = setInterval(async () => {
      const appCheck = await requestToken();
      const accessToken = getAccessTokenFromCookie();
      const sessionToken = getSessionTokenFromCookie(currentIndex + 1);

      if (!accessToken || !sessionToken) {
        return;
      }

      const addrs = sessionsData.map(sesh => sesh.address).join(',');
      const res: PaymentResponseBody = await fetch(`/.netlify/functions/payment?addresses=${addrs}`, {
        headers: {
          [HEADER_APPCHECK]: appCheck,
          [HEADER_JWT_ACCESS_TOKEN]: getAccessTokenFromCookie(),
          [HEADER_JWT_SESSION_TOKEN]: sessionToken.token
        }
      }).then(res => res.json())

      if (!res || res.error) {
        return;
      }

      const payments = res.data.addresses;
      if (payments) {
        setPaymentsData(payments)
      }

      const invalidNotices = payments.map((pm, index) => {
        if (pm.amount !== 0 && pm.amount !== currentSessionData.data.cost * 1000000) {
          return `You sent an invalid payment! We are refunding you, please allow 1-3 hours for confirmation.`;
        }

        return null;
      });

      setInvalidNotices(invalidNotices);
    }, 10000);

    return () => clearInterval(checkPayments);
  }, [currentIndex, paymentsData]);

  const currentSessionData: SessionResponseBody = sessionsData[currentIndex];
  const currentPaymentData: PaymentData = paymentsData && paymentsData.find(data => data.address === currentSessionData.address);
  const currentNotice = invalidNotices && invalidNotices.find((notice, index) => index === currentIndex);

  return (
    <>
      <SEO title="Home" />
      <section id="top">
        <div className="flex justify-start place-content-center">
          {sessionsData.map((session, index) => {
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`${index !== currentIndex ? `bg-dark-100 opacity-60` : `bg-dark-200`} flex-inline items-center justify-center px-4 py-2 rounded-t-lg mr-4`}
              >
                <h4>Session {index + 1} {currentNotice && <>(Error)</>}</h4>
              </button>
            )
          })}
          {sessionsData.length < 3 && (
            <Link
              to="/mint"
              className={`bg-primary-200 hover:bg-primary-200 flex-inline items-center justify-center px-4 py-2 rounded-t-lg mr-4 font-bold text-dark-100`}
            >
              +
            </Link>
          )}
        </div>
        {!sessionsData.length && invalid && (
          <div
            className="grid grid-cols-12 bg-dark-200 rounded-b-lg rounded-tr-lg place-content-center mb-16"
            style={{ minHeight: "60vh" }}
          >
            <div className="col-span-8 col-start-3 justify-center content-center h-full w-full p-8 flex-wrap">
              <div className="text-center">
                <h2 className="font-bold text-3xl text-primary-200 mb-2">
                  Hmm, something's wrong.
                </h2>
                <p className="text-lg">
                  {message} If you're not
                  automatically redirected in 5 seconds,{" "}
                  <Link className="text-primary-100" to="/mint">
                    click here
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        )}
        {sessionsData.length > 0 && !invalid && (
          <div
            className="grid grid-cols-12 bg-dark-200 rounded-b-lg rounded-tr-lg place-content-center mb-16 py-8"
            style={{ minHeight: "60vh" }}
          >
            <div className="col-span-6 p-8">
              <h2 className="font-bold text-3xl mb-2">
                Purchasing:<br/>
                <span className="font-normal text-2xl">
                  <LogoMark fill={getRarityHex(currentSessionData.data.handle)} className="w-4 -mr-1" />{" "}
                  {currentSessionData.data.handle}
                </span>
              </h2>
              <hr className="w-12 border-dark-300 border-2 block my-8" />
              {(currentSessionData.data.cost * 1000000 !== currentPaymentData.amount) && currentPaymentData.amount === 0 && (
                <>
                  <h4 className="text-xl font-bold mb-8">
                    Send exactly {getRarityCost(currentSessionData.data.handle)} $ADA<br/>
                    <span className="text-lg font-normal">to the following address:</span>
                  </h4>
                  <div className="relative">
                    <pre className="p-4 rounded-t-lg shadow-inner shadow-lg bg-dark-300 overflow-hidden opacity-70">
                      {currentSessionData.address}
                    </pre>
                    <button className="absolute top-0 right-0 h-full w-16 bg-primary-100 rounded-tr-lg">Copy</button>
                  </div>
                </>
              )}
              <Countdown
                onComplete={() => {
                  window.location.reload();
                }}
                date={currentSessionData.data.exp}
                renderer={({ formatted, total }) => {
                  const isWarning = (currentPaymentData.amount !== currentSessionData.data.cost * 1000000) && total < 120 * 1000;
                  return (
                    <div
                      className={`${(currentPaymentData.amount === currentSessionData.data.cost * 1000000) ? 'bg-dark-100' : 'rounded-t-none bg-dark-100'} border-t-4 border-primary-100 flex items-center justify-between p-8 rounded-lg shadow-lg`}
                      style={{
                        borderColor: isWarning ? 'red' : ''
                      }}
                    >
                      {currentPaymentData.amount === currentSessionData.data.cost * 1000000 ? (
                        <>
                          <div>
                            <h2 className="text-xl font-bold mb-2"><strong>Yay!</strong> Your payment was successful!</h2>
                            <p className="text-lg">We're minting your handle right now, but we do it in batches. Please allow 1-2 hours for your handle to arrive in your wallet.</p>
                            <p className="text-lg">This session will automatically close in <strong>{formatted.minutes}:{formatted.seconds}</strong></p>
                          </div>
                          <LogoMark className="w-16" fill={'#fff'}  />
                        </>
                      ) : (
                        <>
                          {currentNotice ? (
                            <div className="mt-4">
                              {currentNotice && <p className="text-lg">Whoops! {currentNotice}</p>}
                            </div>
                          ) : (
                            <>
                              <div>
                                {isWarning && <h6 className="text-lg font-bold" style={{ color: 'red' }}>Hurry Up!</h6>}
                                <h2 className="text-xl font-bold mb-2">Waiting for payment...</h2>
                                <h4 className="text-xl">
                                  Time Left: <strong>{formatted.minutes}:{formatted.seconds}</strong>
                                </h4>
                              </div>
                              <Loader className="mx-0" />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )
                }}
              />
            </div>
            <div className="col-span-6 self-center">
              <NFTPreview
                handle={currentSessionData.data.handle}
                showHeader={false}
                showPrice={false}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default SessionPage;
