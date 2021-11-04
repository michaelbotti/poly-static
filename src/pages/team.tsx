import React from "react";

import SEO from "../components/seo";

import Calvin from '../images/calvin.png';
import Goose from '../images/goose.jpeg';
import Conrad from '../images/conrad.jpeg';
import BigIrishLion from '../images/bigirishlion.jpeg';
import PapaGoose from '../images/papagoose.jpeg';

const Twitter = () => (
  <svg className="mt-4 w-8 h-8 block opacity-60 hover:opacity-100" viewBox="0 0 20 20">
    <path
      fill="#48ACF0"
      d="M18.258 3.266a7.254 7.254 0 01-2.277.857 3.607 3.607 0 00-2.618-1.115c-1.98 0-3.586 1.581-3.586 3.53 0 .276.031.545.092.805a10.24 10.24 0 01-7.393-3.689 3.469 3.469 0 00-.486 1.775c0 1.224.633 2.305 1.596 2.938a3.611 3.611 0 01-1.625-.442l-.001.045c0 1.71 1.237 3.138 2.877 3.462a3.67 3.67 0 01-1.619.061 3.584 3.584 0 003.35 2.451 7.268 7.268 0 01-4.454 1.512c-.291 0-.575-.016-.855-.049 1.588 1 3.473 1.586 5.498 1.586 6.598 0 10.205-5.379 10.205-10.045 0-.153-.003-.305-.01-.456a7.273 7.273 0 001.789-1.827 7.31 7.31 0 01-2.06.555 3.554 3.554 0 001.577-1.954"
    />
  </svg>
)

function TeamPage() {
  return (
    <>
      <SEO title="Team" />
      <section className="mb-8 lg:mt-16 lg:mb-32 max-w-xl mx-auto">
        <h2 className="inline-block mb-4 text-4xl text-center font-bold leading-none">
          About the Team
        </h2>
        <p className="text-lg">What started as a simple side-project has become so much more. ADA Handle was started by 3 dudes who were tired
        of long crypto addresses, and thought things could be more simple (and more extendable) than current solutions.</p>
      </section>
      <section className="my-16 max-w-6xl mx-auto">
        <h3 className="text-white text-3xl text-center mb-8">Founders</h3>
        <div className="grid grid-cols-12 lg:gap-16">
          <div className="mb-4 lg:mb-0 col-span-12 lg:col-span-4 p-4 lg:p-8 bg-dark-200 rounded-lg shadow-lg">
            <div className="flex align-center justify-between">
              <div>
                <h3 className="text-3xl font-bold">Calvin</h3>
                <h4 className="uppercase">Cofounder</h4>
                <a href="https://twitter.com/calvinsbrew">
                <Twitter />
                </a>
              </div>
              <img src={Calvin} className="w-20 h-20 rounded-full" />
            </div>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <p>Calvin has nearly 15 years of web software experience ranging from small side-projects to fortune 500 companies, to Facebook.</p>
            <p>Before starting ADA Handle, he started <a className="text-primary-100" href="https://thecryptodrip.com" target="_blank">The Crypto Drip</a> with Goose, a growing
            community of like-minded crypto enthusiests intent on redefining decentralized media.</p>
            <p>Calvin lives in Boise, Idaho with his wife, Tanya, and has 3 boys.</p>
          </div>
          <div className="mb-4 lg:mb-0 col-span-12 lg:col-span-4 p-4 lg:p-8 bg-dark-200 rounded-lg shadow-lg">
            <div className="flex align-center justify-between">
              <div>
                <h3 className="text-3xl font-bold">Conrad</h3>
                <h4 className="uppercase">Cofounder</h4>
                <a href="https://twitter.com/conraddit">
                <Twitter />
                </a>
              </div>
              <img src={Conrad} className="w-20 h-20 rounded-full" />
            </div>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <p>Conrad is an InfoSec and  IT infrastructure engineer, with 20 years of corporate experience, 10 of those in New York City.</p>
            <p>Conrad is a sports aficionado. When he's not working, you'll catch him on the West Side Highway cycling or skateboarding.</p>
            <p>Originally from São Paulo, Conrad moved to New York in 2011. Conrad is married to Caroline.</p>
          </div>
          <div className="mb-4 lg:mb-0 col-span-12 lg:col-span-4 p-4 lg:p-8 bg-dark-200 rounded-lg shadow-lg">
            <div className="flex align-center justify-between">
              <div>
                <h3 className="text-3xl font-bold">Mr. Goose</h3>
                <h4 className="uppercase">Cofounder</h4>
                <a href="https://twitter.com/GooseOfCrypto">
                <Twitter />
                </a>
              </div>
              <img src={Goose} className="w-20 h-20 rounded-full" />
            </div>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <p>Mr. Goose comes from the competitive suit-and-tie world of commercial lending in Silicon Valley.</p>
            <p>After years of stringent professionalism working with some of the largest tech companies in the world, Mr. Goose decided it was time for an about face.</p>
            <p>Finding Cardano was a perfect fit for his ethos as he brings a light-hearted yet severely professional approach to negotiation, management, and business trategy.</p>
          </div>
        </div>

        <hr className="w-12 border-dark-300 border-2 block my-8" />

        <h3 className="text-white text-3xl text-center mb-8">Engineers</h3>
        <div className="grid grid-cols-12 lg:gap-16">
          <div className="mb-4 lg:mb-0 col-span-12 lg:col-span-4 lg:col-start-3 p-4 lg:p-8 bg-dark-200 rounded-lg shadow-lg">
            <div className="flex align-center justify-between">
              <div>
                <h3 className="text-3xl font-bold">BigIrishLion</h3>
                <h4 className="uppercase">Full-Stack Engineer</h4>
                <a href="https://twitter.com/bigirishlion">
                <Twitter />
                </a>
              </div>
              <img src={BigIrishLion} className="w-20 h-20 rounded-full" />
            </div>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <p>BigIrishLion has over 12 years of experience with web and software development with projects ranging from video game sites to archery training mobile applications.</p>
            <p>He is a Serverless evangelist and is proficient with Amazon Web Services and Google Cloud Platform.</p>
            <p>In his spare time, he enjoys coding, cooking sourdough bread with his wife Rachelle and being used as a jungle gym for his 3 kids.</p>
          </div>
          <div className="mb-4 lg:mb-0 col-span-12 lg:col-span-4 p-4 lg:p-8 bg-dark-200 rounded-lg shadow-lg">
            <div className="flex align-center justify-between">
              <div>
                <h3 className="text-3xl font-bold">Papa Goose</h3>
                <h4 className="uppercase">Platform Engineer</h4>
                <a href="https://twitter.com/PapaGooseCrypto">
                <Twitter />
                </a>
              </div>
              <img src={PapaGoose} className="w-20 h-20 rounded-full" />
            </div>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <p>Based in Silicon Valley, this 25-year veteran of coding has spent the last decade in finance tech and platform systems in the great Financial District of San Francisco.</p>
            <p>Papa Goose spends his free time tricking out Lambda functions, burning up Raspberry Pi boards, and building epic marble runs with his two youngest sons. The feathered fatherly friend also has two fully-grown goslings. One is rumored to be a well-respected Crypto aficionado.</p>
          </div>
        </div>

      </section>
    </>
  );
}

export default TeamPage;
