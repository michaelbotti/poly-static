import React from 'react';

import SEO from "../components/seo";
import Wallet from '../images/handle-wallet.svg';

function IndexPage() {

  return (
    <>
      <SEO title="Home" />
      <section id="top" className="h-screen z-0 relative" style={{
        maxHeight: '700px',
        minHeight: '480px'
      }}>
        <div className="grid grid-cols-12 content-center">
          <div className="col-span-12 lg:col-span-10 relative z-10">
            <h2 className="inline-block mt-8 mb-4 text-5xl font-bold leading-none">
              What's your Cardano<br/> <del className="text-dark-300 font-normal">address</del> <span className="font-bold text-primary-200 mr-1">$</span>handle?
            </h2>
            <div className="md:w-2/3 mt-4">
              <p className="text-xl mb-8 md:pr-8">
                Introducing <strong>custom wallet addresses</strong> for the Cardano blockchain. <strong>Secured entirely on-chain</strong>.
              </p>
              <a href="#more" className="text-dark-300 text-lg mt-8 inline-block inline-flex items-center">
                Learn More
                <svg className="svg-icon ml-2" viewBox="0 0 20 20">
                  <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <img className="absolute hidden md:block top-0 right-0 -mt-8 -mr-32 z-0" src={Wallet} />
      </section>
    </>
  );
}

export default IndexPage;
