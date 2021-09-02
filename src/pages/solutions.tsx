import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

import Cardano from "../images/cardano.svg";
import Payment from "../images/payment-simple.svg";
import Ecosystem from "../images/ecosystem.svg";
import NonCustodial from "../images/non-custodial.svg";

function FeaturesPage() {
  return (
    <Layout>
      <SEO title="Features" />
      <section id="more" className="bg-dark-100 px-16 md:px-0">
        <div className="z-10 relative w-full max-w-4xl px-4 pt-4 pb-8 mx-auto md:px-8 md:pt-16 md:pb-32">
          <div className="grid grid-cols-12 py-16 gap-4 content-center">
            <div className="hidden md:block md:col-span-7 px-16 md:px-0">
              <img className="w-full xl:-ml-24" src={Payment} />
            </div>
            <div className="col-span-12 md:col-span-5" id="simple">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight">
                <em>Cardano addresses made simple.</em>
              </h2>
              <div className="text-white">
                <p>
                  Sending and receiving cryptocurrency is a pretty lame
                  experience. You get the most security by sending directly to a
                  cryptographic hash, but you give up{" "}
                  <strong>
                    readability, predictability, and memorization.
                  </strong>
                </p>
                <p>
                  <span className="text-primary-200">@</span>handle ensures that
                  your custom address will always{" "}
                  <strong>resolve to your current wallet address</strong>, every
                  time.
                </p>
              </div>
            </div>
          </div>

          <hr className="mx-auto my-16 w-8 h-1 bg-dark-300 block" />

          <div className="grid grid-cols-12 py-16 gap-4 content-center">
            <div className="col-span-12 md:col-span-5" id="secure">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight">
                <em>Secured by the blockchain.</em>
              </h2>
              <div className="text-white">
                <p>
                  It wouldn't be very interesting to own a custom wallet
                  address, but be forced into relying on a central entity to
                  resolve it.
                </p>
                <p>
                  Thankfully, <span className="text-primary-200">@</span>handle
                  doesn't own the data associated with your address.{" "}
                  <strong>
                    You do, and it's secured on the Cardano blockchain.
                  </strong>
                </p>
                <p>
                  You can think of it like a domain service, but where you own
                  the address perpetually, and the chain (instead of a DNS)
                  takes care of the routing details.
                </p>
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
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight">
                <em>Non-custodial address resolver.</em>
              </h2>
              <div className="text-white">
                <p>
                  <span className="text-primary-200">@</span>handle works
                  completely as an address routing service that lives on the
                  Cardano blockchain. We{" "}
                  <strong>
                    never request, see, or interface with your private wallet
                    keys
                  </strong>
                  .
                </p>
                <p>
                  Instead, we utilize revolutionary new technology to ensure
                  that we simply return a valid Cardano crypto address whenever
                  a @handle is submitted, either to our web app or our upcoming
                  API.
                </p>
              </div>
            </div>
          </div>

          <hr className="mx-auto my-16 w-8 h-1 bg-dark-300 block" />

          <div className="grid grid-cols-12 py-16 gap-4 content-center">
            <div className="col-span-12 md:col-span-5" id="roadmap">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-tight">
                <em>Creating a better crypto experience.</em>
              </h2>
              <div className="text-white">
                <p>
                  <span className="text-primary-200">@</span>handle abstracts
                  the annoyance of complex wallet addresses and replaces it with
                  a <strong>simple and intuitive solution</strong>.
                </p>
                <p>
                  We have big plans, including an slick dApp interface for
                  sending and receiving native Cardano tokens (deployed on
                  launch day), as well as a full-featured public API for
                  websites, wallets, and exchanges to utilize.
                </p>
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

export default FeaturesPage;
