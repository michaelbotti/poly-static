import React, { useState, useEffect } from "react";
import { PageProps, navigate, Link } from "gatsby";
import Countdown from "react-countdown";

import { SessionResponseBody } from "../../netlify/functions/session";
import { Loader } from "../components/Loader";
import { LogoMark } from "../components/logo";
import SEO from "../components/seo";
import { getSessionDataCookie } from "../lib/helpers/session";
import NFTPreview from "../components/NFTPreview";
import { getRarityHex } from "../lib/helpers/nfts";

function SessionPage({
  location,
}: PageProps<object, object, { sessionIndex: number }>) {
  const [invalid, setInvalid] = useState(false);
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
        setInvalid(true);
        setTimeout(() => {
          navigate("/mint");
        }, 5000);

        return;
      }
    })();
  }, []);

  const currentSessionData = sessionsData[currentIndex];
  console.log(currentSessionData, sessionsData, currentIndex, location.state);

  return (
    <>
      <SEO title="Home" />
      <section id="top">
        <div className="flex justify-start place-content-center">
          {sessionsData.map((session, index) => {
            const fillHex = getRarityHex(session.handle);
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`${index !== currentIndex ? `bg-dark-100 opacity-60` : `bg-dark-200`} flex-inline items-center justify-center px-4 py-2 rounded-t-lg mr-4`}
              >
                <h4 className="font-bold text-lg mb-2">
                  <LogoMark fill={fillHex} className="w-3 -mr-1" />{" "}
                  {session.handle}
                </h4>
              </button>
            )
          })}
        </div>
        {!sessionsData.length && invalid && (
          <div
            className="grid grid-cols-12 bg-dark-200 rounded-b-lg rounded-tr-lg place-content-center mb-16"
            style={{ minHeight: "60vh" }}
          >
            <div className="col-span-8 col-start-3 justify-center content-center h-full w-full p-8 flex-wrap">
              <div className="text-center">
                <h2 className="font-bold text-3xl text-primary-200 mb-2">
                  Whoops! You skipped a step.
                </h2>
                <p className="text-lg">
                  You need to start a minting session first. If you're not
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
              <h2 className="font-bold text-3xl mb-2 text-primary-100">
                Purchase Session
              </h2>
              <Countdown
                date={new Date(currentSessionData.data.exp * 1000)}
                onComplete={() => {
                  if (sessionsData.length > 1) {
                    window.location.reload()
                  } else {
                    navigate('/mint');
                  }
                }}
                renderer={({ formatted }) => {
                  return <h4 className="text-xl"><strong>Expire Countdown:</strong> {formatted.minutes}:{formatted.seconds}</h4>
                }}
              />
            </div>
            <div className="col-span-6 self-center">
              <NFTPreview
                handle={currentSessionData.handle}
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
