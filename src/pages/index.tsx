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
        
      </section>
    </Layout>
  );
}

export default IndexPage;
