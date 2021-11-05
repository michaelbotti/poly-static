import React from "react";
import Countdown, { zeroPad } from 'react-countdown';
import Button from "../components/button";

import SEO from "../components/seo";

function MintPage() {
  const targetDate = new Date('Tue Nov 06 2021 14:00:00 UTC');

  return (
    <>
      <SEO title="Mint" />
      <section id="top" className="max-w-3xl mx-auto">
        <div className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg shadow-lg place-content-start p-4 lg:p-8 mb-16">
          <div className="col-span-12 h-full">
            <h2 className="font-bold text-primary-100 text-center">
              <Countdown
                date={targetDate}
                zeroPadTime={2}
                renderer={({
                  days,
                  hours,
                  minutes,
                  seconds
                }) => (
                  <>
                    <span className="text-dark-350 font-normal text-2xl uppercase inline-block mb-8 tracking-wider">Time Till Launch</span>
                    <span className="text-3xl my-2 lg:mt-0 lg:text-jumbo text-primary-200 block">
                      {zeroPad(hours)}h, {zeroPad(minutes)}m, {zeroPad(seconds)}s
                    </span>
                  </>
                )}
              />
            </h2>
            <hr className="w-12 border-dark-300 border-2 block my-8 mx-auto" />
            <h4 className="text-white text-center text-lg lg:text-2xl uppercase tracking-wider">November 6th, 2pm UTC</h4>
            <p className="text-center mt-4">
              <Button href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fadahandle.com&text=@adahandle%20is%20launching%20on%20Saturday%20at%202pm%20UTC%21%20Can%27t%20wait%20to%20get%20my%20Handle%3A&hashtags=Cardano%20%24ADA" buttonStyle="primary">Share on Twitter!</Button>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default MintPage;
