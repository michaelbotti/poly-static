import React from "react";

import SEO from "../components/seo";
import { Button } from '../components/button';
import { Logo } from '../components/logo';

import Wallet from '../images/handle-wallet.svg';
import Cardano from '../images/cardano.svg';
import Payment from '../images/payment-simple.svg';
import Ecosystem from '../images/ecosystem.svg';
import NonCustodial from '../images/non-custodial.svg';

import Maladex from '../images/maladex-logo-small.png';
import SundaeSwap from '../images/sundae.png';
import Nami from '../images/nami.svg';

function IndexPage() {
  return (
    <>
      <SEO
        title="Home"
      />

      <section id="top" className="z-0 max-w-5xl mx-auto relative">
        <div className="grid grid-cols-12 content-center mb-48">
          <div className="col-span-12 lg:col-span-4 relative z-10">
            <h2 className="inline-block mt-8 mb-4 text-5xl font-bold leading-none">
              Cardano addresses made <em>easy.</em>
            </h2>
            <div className="md:w-2/3 mt-4">
              <p className="text-xl mb-8 md:pr-8">
                Introducing <strong>custom wallet addresses</strong> for the Cardano blockchain. <strong>Secured on-chain</strong>.
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
      <section id="partners" className="mb-48 z-10 relative w-full max-w-5xl px-4 pt-4 pb-8 mx-auto md:px-8 md:pt-16">
        <h2 className="text-white text-4xl font-bold leading-tight text-center">Partners</h2>
        <div className="grid grid-cols-12 mt-8 place-content-center gap-8">
          <a href="https://maladex.com" className="block col-span-4 shadow-lg rounded-lg bg-dark-200 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow" target="_blank">
            <img className="w-48" src={Maladex} alt="Maladex" />
          </a>
          <a href="https://namiwallet.io" className="block col-span-4 shadow-lg rounded-lg bg-dark-200 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow" target="_blank">
            <img className="w-28" src={Nami} alt="Nami Wallet" />
          </a>
          <a href="https://sundaeswap.finance" className="block col-span-4 shadow-lg rounded-lg bg-dark-200 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow" target="_blank">
            <img className="w-32" src={SundaeSwap} alt="SundaeSwap" />
          </a>
        </div>
      </section>
      <section id="how-it-works" className="bg-dark-100 px-16 md:px-0">
        <h2 className="text-white text-4xl font-bold leading-tight text-center">How it Works</h2>
        <div className="z-10 relative w-full max-w-5xl px-4 pt-4 pb-8 mx-auto md:px-8 md:pt-16 md:pb-32">
          <div className="grid grid-cols-12 py-16 gap-4 place-items-center">
            <div className="hidden md:block md:col-span-5 px-16 md:px-0">
              <img className="w-full xl:-ml-24" src={Payment} />
            </div>
            <div className="col-span-12 md:col-span-7 p-16 shadow-lg bg-dark-200 rounded-lg" id="simple">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight"><em>Simple &amp; Flexible NFT's on Cardano.</em></h2>
              <div className="text-white">
                <p>Each Handle is a unique NFT, minted and issued on the Cardano blockchain. These NFTs act as unique identifiers for the UTXO that they reside in.</p>
                <p>With a predictable standard, dApp developers can query the Cardano blockchain at any time to determine the current residing address of a Handle.</p>
                <Button animate buttonStyle="secondary" internal link="/mint">Get Your Handle Now! &rarr;</Button>
              </div>
            </div>
          </div>

          <hr className="mx-auto my-16 w-8 h-1 bg-dark-300 block" />

          <div className="grid grid-cols-12 py-16 gap-4 place-items-center">
            <div className="col-span-12 md:col-span-7 p-16 shadow-lg bg-dark-200 rounded-lg" id="simple">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight"><em>Secured Entirely on Cardano Layer 1</em></h2>
              <div className="text-white">
                <p>Unlike many other routing services on Ethereum, Handles are secured entirely as native assets on the Cardano blockchain, on the Layer 1 ledger.</p>
                <p>This means we don't require smart contracts for address routing, ensuring that even in the event of an unlikely smart contract bug, routing
                  will always be accurate — 100% of the time.
                </p>
                <p><strong>Now that's reliable.</strong></p>
                <Button buttonStyle="secondary" internal link="/mint">Purchase a Handle!</Button>
              </div>
            </div>
            <div className="hidden md:block md:col-span-5 px-16 md:px-0">
              <img className="w-full xl:ml-24" src={Cardano} />
            </div>
          </div>

          <hr className="mx-auto my-16 w-8 h-1 bg-dark-300 block" />

          <div className="grid grid-cols-12 py-16 gap-4 content-center">
            <div className="hidden md:block md:col-span-7 px-16 md:px-0">
              <img className="w-full xl:-ml-24" src={NonCustodial} />
            </div>
            <div className="col-span-12 md:col-span-5" id="non-custodial">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight"><em>Non-custodial address resolver.</em></h2>
              <div className="text-white">
                <p>$handle works completely as an address routing service that lives on the Cardano blockchain. We <strong>never request, see, or interface with your private wallet keys</strong>.</p>
                <p>Instead, we utilize revolutionary new technology to ensure that we simply return a valid Cardano crypto address whenever a $handle is submitted, either to our web app or our upcoming API.</p>
                <Button buttonStyle="secondary" internal link="/mint">Purchase a Handle!</Button>
              </div>
            </div>
          </div>

          <hr className="mx-auto my-16 w-8 h-1 bg-dark-300 block" />

          <div className="grid grid-cols-12 py-16 gap-4 content-center">
            <div className="col-span-12 md:col-span-5" id="roadmap">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight"><em>Creating a better crypto experience.</em></h2>
              <div className="text-white">
                <p>$handle abstracts the annoyance of complex wallet addresses and replaces it with a <strong>simple and intuitive solution</strong>.</p>
                <p>We have big plans, including an slick dApp interface for sending and receiving native Cardano tokens (deployed on launch day), as well as a full-featured public API for websites, wallets, and exchanges to utilize.</p>
                <Button buttonStyle="secondary" internal link="/mint">Purchase a Handle!</Button>
              </div>
            </div>
            <div className="hidden md:block md:col-span-7 px-16 md:px-0">
              <img className="w-full xl:ml-24" src={Ecosystem} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default IndexPage;
