import React, { useState, useEffect } from "react";
import { PageProps, navigate, Link } from 'gatsby';
import Countdown from 'react-countdown';

import { SessionResponseBody } from '../../netlify/functions/session';
import { Loader } from '../components/Loader';
// import WalletButton from '../components/WalletButton';
// import NFTPreview from "../components/NFTPreview";
import SEO from "../components/seo";

const STORAGE_KEY = 'currentHandleSession';

export const hasSessionDataFromStorage = (): boolean => {
  const state = window.sessionStorage.getItem(STORAGE_KEY);
  if (!state) {
    return false;
  }

  return true;
}

const hasSessionDataFromState = (state: SessionResponseBody | null): boolean => {
  if (
    !state?.token ||
    !state?.data
  ) {
    return false;
  }

  return true;
}

function SessionPage({ location }: PageProps<object, object, SessionResponseBody>) {
  const [invalid, setInvalid] = useState(false);
  const [sessionData, setSessionData] = useState<SessionResponseBody>(null);

  // Pre-fetch state, ensure hot servers.
  useEffect(() => {
    (async () => {
      const hasSessionStorage = hasSessionDataFromStorage();
      const hasStateStorage = hasSessionDataFromState(location.state);

      if (!hasSessionStorage && !hasStateStorage) {
        setInvalid(true);
        setTimeout(() => {
          navigate('/mint');
        }, 5000);

        return;
      }

      if (hasStateStorage) {
        window.sessionStorage.removeItem(STORAGE_KEY);
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location.state));
        setSessionData(location.state);
      }
      else if (hasSessionStorage) {
        const session = window.sessionStorage.getItem(STORAGE_KEY);
        setSessionData(JSON.parse(session));
      }
    })();
  }, []);

  return (
    <>
      <SEO title="Home" />
      <section id="top">
        <div className="grid grid-cols-12 bg-dark-200 rounded-lg place-content-center mb-16" style={{ minHeight: '60vh' }}>
          <div className="col-span-8 col-start-3 justify-center content-center h-full w-full p-8 flex-wrap">
            {!sessionData && (
              <div className="text-center">
                <Loader/>
                <p className="text-lg">Fetching session details...</p>
                {invalid && (
                  <>
                    <h2 className="font-bold text-3xl text-primary-200 mb-2">Whoops! You skipped a step.</h2>
                    <p className="text-lg">
                      You need to start a minting session first. If you're not automatically redirected, <Link className="text-primary-100" to="/mint">click here</Link>.
                    </p>
                  </>
                )}
              </div>
            )}
            {sessionData && (
              <>
                <Loader />
                <h2 className="font-bold text-3xl text-primary-200 mb-2">
                  test
                  <Countdown date={sessionData.data.iat} />
                </h2>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default SessionPage;
