import React from "react";

import SEO from "../components/seo";
import FAQ from "../components/faq";
import { Link } from "gatsby";

function FAQPage() {
  return (
    <>
      <SEO title="FAQ" />
      <section id="faq" className="lg:my-8 lg:my-16 max-w-3xl mx-auto">
        <section className="mb-8 lg:mt-16 lg:mb-32 max-w-xl mx-auto">
          <h2 className="inline-block mb-4 text-4xl text-center font-bold leading-none">
            FAQ
          </h2>
          <p className="text-lg">Most questions can be answered by browsing the FAQ's below. If your question is not answered, you can reach
          out in <a href="" className="text-primary-100">our Discord</a>, or <Link to={'/contact'} className="text-primary-100">send us a Message</Link></p>
        </section>
        <div className="my-16 max-w-3xl mx-auto">
          <div className="p-4 lg:p-8 bg-dark-200 rounded-lg shadow-lg">
            <FAQ
              faqs={[
                {
                  title: 'What is this project?',
                  description: () => (
                    <p>It's a standardized NFT that developers and users can use to associate an address with a custom and human-readable address.</p>
                  )
                },
                {
                  title: 'How does it work in simple terms?',
                  description: () => (
                    <p>Each handle you purchase will be delivered to you as an NFT. Whatever wallet holds that NFT is where payments will be routed.</p>
                  )
                },
                {
                  title: 'What does an example handle address look like compared to a standard wallet one.',
                  description: () => (
                    <>
                      <p>Handle address: <code>$custom_name</code></p>
                      <p>Cardano native address:</p>
                      <pre className="pre">
                        addr1qxx00r962ku8dl7wekn67kxxxjpcyfyul4dtgkkwzu3nqs5dsnkrcr6p03zvxn2k4vh5scr0hf9nc072lwr4fgs4k43qjswugd
                      </pre>
                    </>
                  )
                },
                {
                  title: 'Can I Still Reserve a Handle?',
                  description: () => (
                    <p>No, reservations have ended. You can still purchase a handle, though, during <Link to="/mint" className="text-primary-100">open sales</Link>.</p>
                  )
                },
                {
                  title: 'What kind of characters can I use?',
                  description: () => (
                    <>
                      <p>
                        For beta launch, you are limited to the following UTF-8 characters:
                      </p>
                      <ul>
                        <li>Alphanumeric: <code>[a-z][A-Z][0-9]</code></li>
                        <li>Dash: <code>-</code></li>
                        <li>Underscore: <code>_</code></li>
                        <li>Period: <code>.</code></li>
                      </ul>
                    </>
                  )
                },
                {
                  title: 'Are handles case-sensitive?',
                  description: () => <p>No, every handle is converted to lowercase.</p>
                },
                {
                  title: 'How much does a Handle cost?',
                  description: () => (
                    <>
                      <p>While we are continuing to fine-tune our rarity attributes to better help the secondary market accurately value their handles, we settled on 5 tiers of pricing and rarity, determined simply by character length:</p>
                      <ul>
                        <li>Legendary (1 character): <strong>Auction Only</strong></li>
                        <li>Ultra Rare (2 characters): <strong>500 $ADA</strong></li>
                        <li>Rare (3 characters): <strong>100 $ADA</strong></li>
                        <li>Common (4–7): <strong>50 $ADA</strong></li>
                        <li>Basic (8–15): <strong>10 $ADA</strong></li>
                      </ul>
                    </>
                  )
                },
                {
                  title: 'What is the max supply?',
                  description: () => (
                    <>
                      <p>For now, the UTF-8 series is maxed at 15 characters in length. Taking into consideration the previously mentioned tiers:</p>
                      <ul>
                        <li>Legendary: <strong>39</strong></li>
                        <li>Ultra Rare: <strong>1,521</strong></li>
                        <li>Rare: <strong>59,319</strong></li>
                        <li>Common: <strong>140,842,288,080</strong></li>
                        <li>Basic: <strong>753,789,555,901,817,000,000,000</strong></li>
                      </ul>
                    </>
                  )
                },
                {
                  title: 'Once purchased, do I have to pay renewal fees?',
                  description: () => <p>No! Each Handle is a one-time sale. You buy it, you own it — forever.</p>
                },
                {
                  title: 'Can I sell it?',
                  description: () => <p>Yes! You can sell your Handle on any Cardano NFT marketplace.</p>
                },
                {
                  title: 'Can I use or buy them from an exchange?',
                  description: () => (
                    <p>
                      NO. If you try to use a handle from an exchange it might be lost forever! Only use it with light wallets and full nodes, such as Daedalus, Nami, and Yoroi.
                    </p>
                  )
                },
                {
                  title: 'How long before we can start using the handle?',
                  description: () => (
                    <>
                      <p>On launch day, you can search for an address at <a href="https://handle.me" target="_blank" rel="noreferrer noopen">https://handle.me"</a>, or
                      share your custom link that corresponds to your Handle, like this: <code>https://handle.me/<strong>$my_new_handle</strong></code></p>
                      <p>
                        dApps will integrate the Handle Standard as they choose. You can already see a list of <Link to="/#partners" className="text-primary-100">our current Partners here</Link>!
                      </p>
                    </>
                  )
                },
                {
                  title: 'What are the future plans of ADA Handle?',
                  description: () => (
                    <ul>
                      <li>Moving to smart contract minting.</li>
                      <li>Burner/recycling pot for privacy and/or temporary handle usage.</li>
                      <li>An official handle marketplace.</li>
                      <li>DAO governance.</li>
                    </ul>
                  )
                }
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default FAQPage;
