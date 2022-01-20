import React, { useContext, useEffect, useMemo, useState } from "react";

import { HandleMintContext } from "../context/mint";
import { usePrimeMintingContext } from "../lib/hooks/primeMintingContext";
import { useAccessOpen } from "../lib/hooks/access";

import SEO from "../components/seo";
import { HandleSearchReserveFlow } from "../components/HandleSearch";
import { Loader } from "../components/Loader";
import NFTPreview from "../components/NFTPreview";
import { HandleQueue } from "../components/HandleQueue";
import { getAccessTokenFromCookie, getAllCurrentSessionData, getSessionTokenFromCookie } from "../lib/helpers/session";
import { HandleSession } from "../components/HandleSession";
import { HandleNavigation } from "../components/HandleNavigation";
import { SessionResponseBody } from "../../netlify/functions/session";
import Countdown from "react-countdown";
import { Link } from "gatsby";

function MintPage() {
  const { primed, handle, currentIndex, betaState } = useContext(HandleMintContext);
  const [paymentSessions, setPaymentSessions] = useState<(false | SessionResponseBody)[]>();
  const [accessOpen, setAccessOpen] = useAccessOpen();

  useEffect(() => {
    setPaymentSessions(getAllCurrentSessionData());
  }, [currentIndex, setPaymentSessions]);

  usePrimeMintingContext();

  const currentAccess = useMemo(() => getAccessTokenFromCookie(), [currentIndex]);
  const currentSession = currentIndex > 0 ? getSessionTokenFromCookie(currentIndex) as SessionResponseBody : null;

  const refreshPaymentSessions = () => {
    setPaymentSessions(getAllCurrentSessionData());
  }

  return (
    <>
      <SEO title="Mint" />
      <section id="top" className="max-w-5xl mx-auto">
        <div
          className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-center p-4 lg:p-8"
          style={{ minHeight: "60vh" }}
          >
            <div className="col-span-12 md:col-span-6 md:col-start-4 relative z-10">
              <h2 className="text-5xl text-center text-primary-200 mt-auto w-full">
                <span className="font-bold text-white">SOLD OUT!</span><br/>
              </h2>
              <p className="text-lg text-dark-350 text-center mt-4">
                The beta sale has successfully finished with ~15,000 Handles purchased! If you sent an incorrect payment, you will receive your refund within 14 days.
              </p>
              <p className="text-lg text-dark-350 text-center mt-4">
                We will re-open minting at a later date!
              </p>
            </div>
          </div>
      </section>
    </>
  );
}

export default MintPage;
