import React, { useState, useEffect } from "react";
import { PageProps, navigate, Link } from 'gatsby';

// import { AppContext } from '../context/app';
// import { HandleMintContext } from '../../src/context/handleSearch';

import { Loader } from '../components/Loader';
// import WalletButton from '../components/WalletButton';
// import NFTPreview from "../components/NFTPreview";
import SEO from "../components/seo";
// import { HandleSearchReserveFlow, HandleSearchPurchaseFlow } from "../components/HandleSearch";

function SessionPage({ location }: PageProps) {
  const [hasSession, setHasSession] = useState<boolean>(false);

  // Pre-fetch state, ensure hot servers.
  useEffect(() => {
    console.log('test');
    (async () => {
      if (!location.state) {
        setTimeout(() => {
          navigate('/mint');
        }, 5000);

        return;
      }

      setHasSession(true);

      // const reservedData = await fetch('/.netlify/functions/reservedHandles').then(res => res.json());
      // const reserved = JSON.parse(reservedData);
      // setReservedHandles(reserved);
      // // console.log(reserved.twitter.filter(user => user.length < 4));
      // setLoaded(true);
    })();
  }, []);

  return (
    <>
      <SEO title="Home" />
      <section id="top">
        <div className="grid grid-cols-12 bg-dark-200 rounded-lg place-content-center mb-16" style={{ minHeight: '60vh' }}>
          <div className="col-span-8 col-start-3 justify-center content-center h-full w-full p-8 flex-wrap">
            {!hasSession && (
              <div className="text-center">
                <Loader/>
                <h2 className="font-bold text-3xl text-primary-200 mb-2">Whoops! You skipped a step.</h2>
                <p className="text-lg">
                  You need to start a minting session first. If you're not automatically redirected, <Link className="text-primary-100" to="/mint">click here</Link>.
                </p>
              </div>
            )}
            {hasSession && (
              <>
                <p className="w-full text-center">Building transaction...</p>
                <Loader />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default SessionPage;
