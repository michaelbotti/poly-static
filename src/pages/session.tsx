import React, { useState, useContext, useEffect } from "react";
import { PageProps } from 'gatsby';

// import { AppContext } from '../context/app';
// import { HandleMintContext } from '../../src/context/handleSearch';

import { Loader } from '../components/Loader';
// import WalletButton from '../components/WalletButton';
// import NFTPreview from "../components/NFTPreview";
import SEO from "../components/seo";
// import { HandleSearchReserveFlow, HandleSearchPurchaseFlow } from "../components/HandleSearch";

function ReservePage({ location }: PageProps) {
  console.log(location.state);

  // Pre-fetch state, ensure hot servers.
  useEffect(() => {
    (async () => {
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
        <div className="grid grid-cols-12 bg-dark-200 rounded-lg place-content-center">
          <>
            <h2 className="text-4xl">Your Session Has Started</h2>
            <p><strong>DO NOT</strong> close this window or your session will be lost and you'll have to try again after it expires.</p>
            <Loader />
          </>
        </div>
      </section>
    </>
  );
}

export default ReservePage;
