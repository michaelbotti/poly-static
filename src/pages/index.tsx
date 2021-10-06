import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Form from '../components/mailchimp';
import { Logo } from '../components/logo';

import Wallet from '../images/handle-wallet.svg';
import Cardano from '../images/cardano.svg';
import Payment from '../images/payment-simple.svg';
import Ecosystem from '../images/ecosystem.svg';
import NonCustodial from '../images/non-custodial.svg';

import Maladex from '../images/maladex-logo-small.png';

function IndexPage() {
  return (
    <Layout>
      <SEO
        title="Home"
      />

      <section id="top" className="z-0 relative" style={{
        // minHeight: '75vh'
      }}>
        <div className="grid grid-cols-12 content-center mb-48">
          <div className="col-span-12 lg:col-span-10 relative z-10">
            <h2 className="inline-block mt-8 mb-4 text-5xl font-bold leading-none">
              What's your Cardano<br/> <del className="text-dark-300 font-normal">address</del> <Logo className="w-48 mb-2 inline" labeledBy="header-logo" />?
            </h2>
            <div className="md:w-2/3 mt-4">
              <p className="text-xl mb-8 md:pr-8">
                Introducing <strong>custom wallet addresses</strong> for the Cardano blockchain. <strong>Secured on-chain</strong>.
              </p>
              <Form />
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
      <section id="more" className="bg-dark-100 px-16 md:px-0">
        <section className="z-10 relative w-full max-w-4xl px-4 pt-4 pb-8 mx-auto md:px-8 md:pt-16">
          <h2 className="text-white text-4xl font-bold leading-tight text-center">Partners</h2>
          <div className="flex mt-8 justify-center align-center">
            <a href="https://maladex.com" className="block w-48" rel="nofollow" target="_blank">
              <img className="w-full" src={Maladex} alt="Maladex" />
            </a>
          </div>
        </section>
        <div className="z-10 relative w-full max-w-4xl px-4 pt-4 pb-8 mx-auto md:px-8 md:pt-16 md:pb-32">
          <div className="grid grid-cols-12 py-16 gap-4 content-center">
            <div className="hidden md:block md:col-span-7 px-16 md:px-0">
              <img className="w-full xl:-ml-24" src={Payment} />
            </div>
            <div className="col-span-12 md:col-span-5" id="simple">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight"><em>Cardano addresses made simple.</em></h2>
              <div className="text-white">
                <p>Sending and receiving cryptocurrency is a pretty lame experience. You get the most security by sending directly to a cryptographic hash, but you give up <strong>readability, predictability, and memorization.</strong></p>
                <p>$handle ensures that your custom address will always <strong>resolve to your current wallet address</strong>, every time.</p>
                <a href="#top" className="form-input hover:shadow-lg cursor-pointer mt-4 block py-4 px-6 bg-primary-100 hover:bg-dark-100 focus:bg-dark-100 text-white text-center rounded-lg inline-block font-bold h-full">Join the Waitlist</a>
              </div>
            </div>
          </div>

          <hr className="mx-auto my-16 w-8 h-1 bg-dark-300 block" />

          <div className="grid grid-cols-12 py-16 gap-4 content-center">
            <div className="col-span-12 md:col-span-5" id="secure">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight"><em>Secured by the blockchain.</em></h2>
              <div className="text-white">
                <p>It wouldn't be very interesting to own a custom wallet address, but be forced into relying on a central entity to resolve it.</p>
                <p>Thankfully, $handle doesn't own the data associated with your address. <strong>You do, and it's secured on the Cardano blockchain.</strong></p>
                <p>You can think of it like a domain service, but where you own the address perpetually, and the chain (instead of a DNS) takes care of the routing details.</p>
                <a href="#top" className="form-input hover:shadow-lg cursor-pointer mt-4 block py-4 px-6 bg-primary-100 hover:bg-dark-100 focus:bg-dark-100 text-white text-center rounded-lg inline-block font-bold h-full">Join the Waitlist</a>
              </div>
            </div>
            <div className="hidden md:block md:col-span-7 px-16 md:px-0">
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
                <a href="#top" className="form-input hover:shadow-lg cursor-pointer mt-4 block py-4 px-6 bg-primary-100 hover:bg-dark-100 focus:bg-dark-100 text-white text-center rounded-lg inline-block font-bold h-full">Join the Waitlist</a>
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
                <a href="#top" className="form-input hover:shadow-lg cursor-pointer mt-4 block py-4 px-6 bg-primary-100 hover:bg-dark-100 focus:bg-dark-100 text-white text-center rounded-lg inline-block font-bold h-full">Join the Waitlist</a>
              </div>
            </div>
            <div className="hidden md:block md:col-span-7 px-16 md:px-0">
              <img className="w-full xl:ml-24" src={Ecosystem} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default IndexPage;
