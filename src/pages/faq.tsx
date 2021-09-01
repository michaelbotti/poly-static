import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import FAQ from "../components/faq";

function FAQPage() {
  return (
    <Layout>
      <SEO title="FAQ" />
      <section id="faq" className="mt-16 max-w-xl mx-auto">
        <h2 className="inline-block mb-4 text-4xl font-bold leading-none">
          FAQ
        </h2>
        <FAQ
          faqs={[
            {
              title: "Why would I want to buy a @handle?",
              description: () => (
                <>
                  <p>
                    Cryptocurrencies are cryptographically guaranteed ledgers.
                    That means that every time you want to receive crypto, you
                    need to know your wallet address as well as the sender's.
                  </p>
                  <p>
                    Normally this wouldn't be a big deal — except that in
                    crypto, addresses are encrypted key pairs, and on Cardano
                    they look like this:
                  </p>
                  <p>
                    <code>addr1q9wt6pdnl3v4m29...qtmyxyqamvv22sv7pj7q</code>
                  </p>
                  <p>
                    That's not very pretty, nor or easy to remember. Once you
                    own an @ADA Handle NFT, you can use our platform to send and
                    receive crypto purely by using your address.
                  </p>
                </>
              ),
            },
            {
              title: "Is this platform decentralized?",
              description: () => (
                <>
                  <p>
                    Yes and no. Currently, the NFT you receive after purchasing
                    guarantees ownership of your @handle, lets you change the
                    associated address trustlessly, and allows you to sell that
                    ownership to anyone else.
                  </p>
                  <p>
                    However, the interface to interpret this is a centralized
                    one that we maintain. We have a financial incentive to
                    interpret an accurate send addresses so that customers keep
                    purchasing NFTs and using our platform.
                  </p>
                  <p>
                    Furthermore, we maintain a centralized pay-to-use API
                    service to allow wallet and web developers to integrate @ADA
                    Handle into their app, further incentivizing operational
                    integrity.
                  </p>
                  <p>
                    That being said,{" "}
                    <strong>
                      the actual data we are providing is available on the
                      Cardano blockchain
                    </strong>
                    , and can be verified or repurposed by anyone.
                  </p>
                </>
              ),
            },
            {
              title: "How can I be sure the send address is accurate?",
              description: () => (
                <>
                  <p>
                    When building an actual transaction, we{" "}
                    <strong>query the Cardano blockchain directly</strong> to
                    guarantee an accurate send address.
                  </p>
                  <p>
                    Additionally, and especially in the cases of sending large
                    $ADA amounts, we show the interpreted address so that you
                    can verify the send address yourself.
                  </p>
                  <p>
                    Explicit confirmation of the send address will always be
                    required before initiating a wallet transaction.
                  </p>
                </>
              ),
            },
            {
              title: "How much does a handle cost?",
              description: () => (
                <>
                  <p>
                    There will be 3 NFT pre-sale phases, ending in permanent
                    availability. This will allow us to adequately handle demand
                    and scale our resources, and also catch any bugs along the
                    way.
                  </p>
                  <p>The 3 phases are:</p>
                  <ol>
                    <li>
                      <strong>Beta Phase</strong>: Each NFT address is{" "}
                      <strong>10 $ADA</strong>, and limited to 500 addresses.
                    </li>
                    <li>
                      <strong>Early Bird Phase</strong>: Each NFT address is{" "}
                      <strong>30 $ADA</strong>, and limited to 5,000 addresses.
                    </li>
                    <li>
                      <strong>Open Phase</strong>: Each NFT address is{" "}
                      <strong>100 $ADA</strong>, and is only limited to @handle
                      availability.
                    </li>
                  </ol>
                </>
              ),
            },
            {
              title: "Do both receiver and sender need a @handle?",
              description: () => (
                <>
                  <p>
                    No! Any @handle you purchase will be usable by anyone, even
                    if they don't own one themselves.
                  </p>
                </>
              ),
            },
            {
              title: "Can I get a refund?",
              description: () => (
                <>
                  <p>
                    No, we do not offer refunds. However, we do offer 1-3 day
                    support.
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>
    </Layout>
  );
}

export default FAQPage;