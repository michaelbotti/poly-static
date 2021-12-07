import React from "react";

import SEO from "../components/seo";

import Cardano from '../images/cardano.svg';
import Payment from '../images/payment-simple.svg';
import Ecosystem from '../images/ecosystem.svg';
import NonCustodial from '../images/non-custodial.svg';
import App from '../images/app-bg.png';
import b58 from '../images/logo_b58_wallet_flat.png';
import Maladex from '../images/maladex-logo-small.png';
import SundaeSwap from '../images/sundae.png';
import Nami from '../images/nami.svg';
import Gero from '../images/gerowallet.png';
import Ridotto from '../images/RIDOTTO.png';
import VyFi from '../images/vyfi.png';
import NFTMaker from '../images/nft-maker.png';
import Cardax from '../images/cardax.png';
import WM from '../images/wm.png';
import Indigo from '../images/Eye-white.png';

function IndexPage() {
  return (
    <>
      <SEO
        title="Home"
      />

      <section id="top" className="z-0 relative mb-0">
        <div className="grid grid-cols-12 content-center overflow-hidden max-w-5xl mx-auto">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3 relative z-10 text-center">
            <h2 className="inline-block mt-8 mb-4 text-5xl font-bold leading-none">
              <em>Custom</em> Cardano addresses for everyone.
            </h2>
            <div className="mt-4">
              <p className="text-xl mb-8 lg:pr-8 text-dark-350">
                An <strong className="underline">NFT-powered</strong> naming solution for your Cardano wallet address, secured entirely on-chain via the Handle Standard.
              </p>
              <a href="#integrations" className="text-primary-100 text-lg inline-block inline-flex items-center">
                Learn More
                <svg className="svg-icon ml-2" viewBox="0 0 20 20">
                  <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="absolute w-full bottom-0 left-0 z-10 bg-gradient-to-t from-dark-100 h-1/2"></div>
          <img src={App} className="w-full right-0 left-0 bottom-0" />
        </div>
      </section>
      <div className="bg-dark-200 -mx-8">
        <section id="integrations" className="mb-48 z-10 relative w-full max-w-5xl px-4 pt-4 pb-8 mx-auto lg:px-8 lg:pt-16">
          <h2 className="text-white text-4xl font-bold leading-tight text-center">Partners</h2>
          <div className="grid grid-cols-12 mt-8 place-content-center gap-8 px-4 lg:px-0">
            <a href="https://maladex.com" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-48" src={Maladex} alt="Maladex" />
            </a>
            <a href="https://namiwallet.io" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-28" src={Nami} alt="Nami Wallet" />
            </a>
            <a href="https://sundaeswap.finance" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-32" src={SundaeSwap} alt="SundaeSwap" />
            </a>
            <a href="https://b58.finance/" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-32" src={b58} alt="b58 Finance" />
            </a>
            <a href="https://worldmobile.io/" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-36" src={WM} alt="World Mobile" />
            </a>
            <a href="https://gerowallet.io/" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-32" src={Gero} alt="Gero Wallet" />
            </a>
            <a href="https://ridotto.io" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-48" src={Ridotto} alt="Ridotto" />
            </a>
            <a href="https://pro.nft-maker.io/" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-48" src={NFTMaker} alt="NFT-Maker" />
            </a>
            <a href="https://www.vyfi.io/" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-32" src={VyFi} alt="VyFi" />
            </a>
            <a href="https://cardax.io/" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-36" src={Cardax} alt="Cardax" />
            </a>
            <a href="https://indigoprotocol.io/" className="block col-span-6 lg:col-span-4 shadow-lg rounded-lg bg-dark-100 p-8 lg:p-16 flex items-center justify-center transform hover:-translate-y-2" rel="nofollow noopener" target="_blank">
              <img className="w-32" src={Indigo} alt="Indigo Protocol" />
            </a>
          </div>
        </section>
      </div>
      <section id="how-it-works" className="bg-dark-100">
        <h2 className="text-white text-4xl font-bold leading-tight text-center">How it Works</h2>
        <div className="z-10 relative w-full max-w-5xl px-4 pt-4 pb-8 mx-auto lg:px-8 lg:pt-16 lg:pb-32">
          <div className="grid grid-cols-12 py-16 gap-4 place-items-center">
            <div className="hidden lg:block lg:col-span-5 px-16 lg:px-0">
              <img className="w-full xl:-ml-24" src={Payment} />
            </div>
            <div className="col-span-12 lg:col-span-7 p-8 lg:p-16 shadow-lg bg-dark-200 rounded-lg" id="simple">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight"><em>Simple &amp; Flexible NFT's on Cardano.</em></h2>
              <div className="text-white">
                <p>Each Handle is a unique NFT, minted and issued on the Cardano blockchain. These NFTs act as unique identifiers for the UTXO that they reside in.</p>
                <p>With a predictable standard, dApp developers can query the Cardano blockchain at any time to determine the current residing address of a Handle.</p>
              </div>
            </div>
          </div>

          <hr className="w-12 border-dark-300 border-2 block my-8 mx-auto" />

          <div className="grid grid-cols-12 py-16 gap-4 place-items-center">
            <div className="col-span-12 lg:col-span-7 p-8 lg:p-16 shadow-lg bg-dark-200 rounded-lg" id="simple">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight"><em>Secured Entirely on Cardano Layer 1</em></h2>
              <div className="text-white">
                <p>Unlike many other routing services on Ethereum, Handles are secured entirely as native assets on the Cardano blockchain, on the Layer 1 ledger.</p>
                <p>This means we don't require smart contracts for address routing, ensuring that even in the event of an unlikely smart contract bug, routing
                  will always be accurate — 100% of the time.
                </p>
                <p><strong>Now that's reliable.</strong></p>
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-5 px-16 lg:px-0">
              <img className="w-full xl:ml-24" src={NonCustodial} />
            </div>
          </div>

          <hr className="w-12 border-dark-300 border-2 block my-8 mx-auto" />

          <div className="grid grid-cols-12 py-16 gap-4 place-items-center">
            <div className="hidden lg:block lg:col-span-5 px-16 lg:px-0">
              <img className="w-full xl:-ml-24" src={Cardano} />
            </div>
            <div className="col-span-12 lg:col-span-7 p-8 lg:p-16 shadow-lg bg-dark-200 rounded-lg" id="simple">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight"><em>A Standard for Upgrades</em></h2>
              <div className="text-white">
                <p>The Handle Standard supports version upgrading and backwards compatability. Once a version change happens, Partners are notified of the new version's Policy ID.</p>
                <p>Lookups happen from most recent Policy ID to the first, incentivizing upgrades among users to ensure faster retrieval results.</p>
                <p>This allows the Handle Standard to evolve with the broader Cardano ecosystem.</p>
              </div>
            </div>
          </div>

          <hr className="w-12 border-dark-300 border-2 block my-8 mx-auto" />

          <div className="grid grid-cols-12 py-16 gap-4 place-items-center">
            <div className="col-span-12 lg:col-span-7 p-8 lg:p-16 shadow-lg bg-dark-200 rounded-lg" id="simple">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight"><em>Handle Augmentation<br/> &amp; A Composable Future</em></h2>
              <div className="text-white">
                <p>ADA Handle has an in-depth roadmap for the future including a future DAO for governance, and community-voted on Handle Augmentation support.</p>
                <p>Aside from the countless use-cases for standardized naming (such as an integrated mobile wallet experience similar to Cash App), Handle Augmentation
                  will allow users to opt-in to additional metadata added to their unique Handle, providing an extendable pattern for Partners to build upon.
                </p>
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-5 px-16 lg:px-0">
              <img className="w-full xl:ml-24" src={Ecosystem} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default IndexPage;
