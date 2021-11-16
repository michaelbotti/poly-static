import React from "react";
import Countdown, { zeroPad } from 'react-countdown';
import Button from "../components/button";

import SEO from "../components/seo";

function MintPage() {
  const targetDate = new Date('Wed Nov 11 2021 03:30:00 UTC');

  return (
    <>
      <SEO title="Mint" />
      <section id="top" className="max-w-3xl mx-auto">
        <div className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg shadow-lg place-content-start p-4 lg:p-16 mb-16">
          <div className="col-span-12 h-full">
            <h2 className="font-bold text-primary-100 text-center">
              <Countdown
                date={targetDate}
                zeroPadTime={2}
                renderer={({
                  hours,
                  minutes,
                  seconds
                }) => (
                  <>
                    <span className="text-5xl lg:text-jumbo block mb-2">Testnet Launch</span>
                    <span className="text-3xl mt-2 lg:mt-0 lg:text-5xl text-primary-200 block">
                      {zeroPad(hours)}h, {zeroPad(minutes)}m, {zeroPad(seconds)}s
                    </span>
                  </>
                )}
              />
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}

export default MintPage;
