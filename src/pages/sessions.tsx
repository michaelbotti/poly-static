import React, { useState, useEffect } from "react";
import { PageProps, navigate, Link } from "gatsby";
import Countdown from "react-countdown";
import { useQuery } from "react-apollo";

import { SessionResponseBody } from "../../netlify/functions/session";
import { LogoMark } from "../components/logo";
import SEO from "../components/seo";
import { getSessionDataCookie } from "../lib/helpers/session";
import NFTPreview from "../components/NFTPreview";
import { getRarityCost, getRarityHex, getRaritySlug, getRarityColor } from "../lib/helpers/nfts";
import Button from "../components/button";
import { HEADER_AUTH_TOKEN, HEADER_HANDLE, HEADER_APPCHECK } from "../lib/constants";
import { requestToken } from "../lib/firebase";

function SessionPage({
  location,
}: PageProps<object, object, { sessionIndex: number }>) {
  const [invalid, setInvalid] = useState(false);
  const [message, setMessage] = useState<string>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sessionsData, setSessionsData] = useState<SessionResponseBody[]>([]);

  useEffect(() => {
    (async () => {
      const sessionsFromCookie = getSessionDataCookie();

      if (sessionsFromCookie.length) {
        setSessionsData(sessionsFromCookie);

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

  const currentSessionData = sessionsData[currentIndex];

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
                <h4>Session {index + 1}</h4>
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
                  <LogoMark fill={getRarityHex(currentSessionData.data.payload.handle)} className="w-4 -mr-1" />{" "}
                  {currentSessionData.data.payload.handle}
                </span>
              </h2>
              <hr className="w-12 border-dark-300 border-2 block my-8" />
              <h4 className="text-xl font-bold mb-8">
                Send exactly {getRarityCost(currentSessionData.data.payload.handle)} $ADA<br/>
                <span className="text-lg font-normal">to the following address:</span>
              </h4>
              <pre className="p-4 bg-dark-300 overflow-hidden">{currentSessionData.address}</pre>
            </div>
            <div className="col-span-6 self-center">
              <div className="text-center mb-4">
                <Countdown
                  date={new Date(currentSessionData.data.payload.exp * 1000)}
                  onComplete={() => {
                    if (sessionsData.length > 1) {
                      window.location.reload()
                    } else {
                      navigate('/mint');
                    }
                  }}
                  renderer={({ formatted }) => {
                    return <h4 className="text-xl">Time Left: <strong>{formatted.minutes}:{formatted.seconds}</strong></h4>
                  }}
                />
              </div>
              <NFTPreview
                handle={currentSessionData.data.payload.handle}
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
