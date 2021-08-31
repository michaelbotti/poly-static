import React from "react";
import { Link } from 'gatsby';

import Layout from "../components/layout";
import SEO from "../components/seo";
import { FAQ } from '../components/faq';

function IndexPage() {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />

      <section className="h-screen -mb-40 z-0" style={{
        maxHeight: '700px',
        minHeight: '480px'
      }}>
        <h2 className="inline-block mb-4 text-jumbo font-bold leading-none">
          <span className="text-primary-100">Readable</span> wallet addresses <span className="text-primary-100">you own</span>.
        </h2>
        <div className="w-96">
          <p className="text-xl">
            Introducing the first <strong>custom address solution</strong> for the Cardano blockchain, <strong>backed by non-fungible tokens</strong>.
          </p>
        </div>
        <a href="#more" className="shadow-lg mt-8 py-4 px-6 bg-dark-100 hover:bg-dark-200 focus:bg-dark-200 text-white text-center rounded-lg inline-block font-bold">Learn More</a>
        <Link to="/buy" className="shadow-lg mt-8 ml-4 py-4 px-6 bg-primary-200 hover:text-dark-100 focus:bg-dark-200 text-white text-center rounded-lg inline-block font-bold">Pre-Register Your @handle</Link>
      </section>
      <section id="more" className="bg-dark-200">
        <div className="z-10 relative w-full max-w-4xl px-4 py-8 mx-auto md:px-8 md:py-16">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">

            </div>
            <div className="col-span-4">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-none"><em>Goodbye copy &amp; paste.</em></h2>
              <div className="text-white">
                <p>Sending and receiving cryptocurrency is a pretty lame experience. You get the most security by sending directly to a cryptographic hash, but you give up <strong>readability, predictability, and memorization.</strong></p>
                <p>With <em>@ADA Handle</em>, you relax knowing that your handle will always resolve the correct wallet address.</p>
              </div>
            </div>
          </div>

          <hr className="mx-auto my-16 w-8 h-1 bg-dark-300 block" />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-none"><em>Owned by you. Forever.</em></h2>
              <div className="text-white">
                <p>We guarantee persistent @handle ownership by <strong>selling users a special NFT</strong>, minted at the time of transaction. This acts as a register for your address, and lives entirely on the blockchain.</p>
                <p>Once owned, this NFT can <strong>never be taken away</strong>, suspended, or moved without the owner's explicit permission.</p>
              </div>
            </div>
            <div className="col-span-8">

            </div>
          </div>

          <hr className="mx-auto my-16 w-8 h-1 bg-dark-300 block" />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">

            </div>
            <div className="col-span-4">
              <h2 className="inline-block text-white mb-4 text-4xl font-bold leading-none"><em>How does it work?</em></h2>
              <div className="text-white">
                <p>Using our <a href="#">web app</a>, you can send any native Cardano token to any @handle (as long as it exists).</p>
                <p>Using our API, our web app will convert that handle to whatever address is associated with it, and build a transaction for you to confirm.</p>
                <p>We query the blockchain directly, but don't worry — you'll be able to see the interpreted address and verify it yourself if you want to.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mt-16 max-w-xl mx-auto">
        <h2 className="inline-block mb-4 text-4xl font-bold leading-none">FAQ</h2>
        <FAQ faqs={[
          {
            title: 'Why would I want to buy a @handle?',
            description: () => (
              <>
                <p>Cryptocurrencies are cryptographically guaranteed ledgers. That means that every time you want to receive crypto, you need to know your wallet address as well as the sender's.</p>
                <p>Normally this wouldn't be a big deal — except that in crypto, addresses are encrypted key pairs, and on Cardano they look like this:</p>
                <p><code>addr1q9wt6pdnl3v4m29...qtmyxyqamvv22sv7pj7q</code></p>
                <p>That's not very pretty, nor or easy to remember. Once you own an @ADA Handle NFT, you can use our platform to send and receive crypto purely by using your address.</p>
              </>
            )
          },
          {
            title: 'Is this platform decentralized?',
            description: () => (
              <>
                <p>Yes and no. Currently, the NFT you receive after purchasing guarantees ownership of your @handle, lets you change the associated address trustlessly, and allows you to sell that ownership to anyone else.</p>
                <p>However, the interface to interpret this is a centralized one that we maintain. We have a financial incentive to interpret an accurate send addresses so that customers keep purchasing NFTs and using our platform.</p>
                <p>Furthermore, we maintain a centralized pay-to-use API service to allow wallet and web developers to integrate @ADA Handle into their app, further incentivizing operational integrity.</p>
                <p>That being said, <strong>the actual data we are providing is available on the Cardano blockchain</strong>, and can be verified or repurposed by anyone.</p>
              </>
            )
          },
          {
            title: 'How can I be sure the send address is accurate?',
            description: () => (
              <>
                <p>When building an actual transaction, we <strong>query the Cardano blockchain directly</strong> to guarantee an accurate send address.</p>
                <p>Additionally, and especially in the cases of sending large $ADA amounts, we show the interpreted address so that you can verify the send address yourself.</p>
                <p>Explicit confirmation of the send address will always be required before initiating a wallet transaction.</p>
              </>
            )
          },
          {
            title: 'How much does a handle cost?',
            description: () => (
              <>
                <p>There will be 3 NFT pre-sale phases, ending in permanent availability. This will allow us to adequately handle demand and scale our resources, and also catch any bugs along the way.</p>
                <p>The 3 phases are:</p>
                <ol>
                  <li><strong>Beta Phase</strong>: Each NFT address is <strong>10 $ADA</strong>, and limited to 500 addresses.</li>
                  <li><strong>Early Bird Phase</strong>: Each NFT address is <strong>30 $ADA</strong>, and limited to 5,000 addresses.</li>
                  <li><strong>Open Phase</strong>: Each NFT address is <strong>100 $ADA</strong>, and is only limited to @handle availability.</li>
                </ol>
              </>
            )
          },
          {
            title: 'Do both receiver and sender need a @handle?',
            description: () => (
              <>
                <p>No! Any @handle you purchase will be usable by anyone, even if they don't own one themselves.</p>
              </>
            )
          },
          {
            title: 'Can I get a refund?',
            description: () => (
              <>
                <p>No, we do not offer refunds. However, we do offer 1-3 day support.</p>
              </>
            )
          }
        ]} />
      </section>
    </Layout>
  );
}

export default IndexPage;
