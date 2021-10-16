import React from "react";

import SEO from "../components/seo";

import Calvin from '../images/calvin.jpeg';

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
      <section className="mt-16 mb-32 max-w-xl mx-auto">
        <h2 className="inline-block mb-4 text-4xl text-center font-bold leading-none">
          About the Team
        </h2>
        <p className="text-lg">What started as a simple side-project has become so much more. ADA Handle was started by 3 dudes who were tired
        of long crypto addresses, and thought things could be more simple (and more extendable) than current solutions.</p>
      </section>
      <section className="my-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-12 gap-16">
          <div className="col-12 lg:col-span-4">
            <div className="flex align-center justify-between">
              <div>
                <h3 className="text-5xl font-bold">Calvin</h3>
                <h4 className="uppercase">Cofounder</h4>
                <a href="https://twitter.com/calvinsbrew">
                <Twitter />
                </a>
              </div>
              <img src={Calvin} className="w-24 h-24 rounded-full" />
            </div>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <p>Calvin has nearly 15 years of web software experience ranging from small side-projects to fortune 500 companies, to Facebook.</p>
            <p>Always a tinkerer and idea-person, Calvin immediately fell in love with the Cardano ecosystem and blockchain in general.</p>
            <p>Before starting ADA Handle, he started <a className="text-primary-100" href="https://thecryptodrip.com" target="_blank">The Crypto Drip</a> with Goose, a growing
            community of like-minded crypto enthusiests intent on redefining decentralized media.</p>
          </div>
          <div className="col-12 lg:col-span-4">
            <div className="flex align-center justify-between">
              <div>
                <h3 className="text-5xl font-bold">Conrad</h3>
                <h4 className="uppercase">Cofounder</h4>
                <a href="https://twitter.com/calvinsbrew">
                <Twitter />
                </a>
              </div>
              <img src={Calvin} className="w-24 h-24 rounded-full" />
            </div>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <p>Calvin has nearly 15 years of web software experience ranging from small side-projects to fortune 500 companies, to Facebook.</p>
            <p>Always a tinkerer and idea-person, Calvin immediately fell in love with the Cardano ecosystem and blockchain in general.</p>
            <p>Before starting ADA Handle, he started <a className="text-primary-100" href="https://thecryptodrip.com" target="_blank">The Crypto Drip</a> with Goose, a growing
            community of like-minded crypto enthusiests intent on redefining decentralized media.</p>
          </div>
          <div className="col-12 lg:col-span-4">
            <div className="flex align-center justify-between">
              <div>
                <h3 className="text-5xl font-bold">Mr. Goose</h3>
                <h4 className="uppercase">Cofounder</h4>
                <a href="https://twitter.com/calvinsbrew">
                <Twitter />
                </a>
              </div>
              <img src={Calvin} className="w-24 h-24 rounded-full" />
            </div>
            <hr className="w-12 border-dark-300 border-2 block my-8" />
            <p>Calvin has nearly 15 years of web software experience ranging from small side-projects to fortune 500 companies, to Facebook.</p>
            <p>Always a tinkerer and idea-person, Calvin immediately fell in love with the Cardano ecosystem and blockchain in general.</p>
            <p>Before starting ADA Handle, he started <a className="text-primary-100" href="https://thecryptodrip.com" target="_blank">The Crypto Drip</a> with Goose, a growing
            community of like-minded crypto enthusiests intent on redefining decentralized media.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default TeamPage;
