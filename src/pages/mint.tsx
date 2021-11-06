import { Link } from "gatsby";
import React from "react";

import SEO from "../components/seo";

function MintPage() {
  return (
    <>
      <SEO title="Mint" />
      <section id="top" className="max-w-3xl mx-auto">
        <div className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg shadow-lg place-content-start p-4 lg:p-8 mb-16">
          <div className="col-span-12 h-full">
            <h2 className="font-bold text-jumbo text-primary-100 text-center">
              Uh-oh!
            </h2>
            <p className="text-lg text-center">
              We're busy fixing some issues. We're sorry for the inconvenience! We're working on resolving the problem as soon as possible.
            </p>
            <p className="text-lg text-center">
              For updates, follow our official <a href="https://twitter.com/adahandle" target="_blank" rel="noopener nofollow" className="text-primary-100">Twitter account</a>. If you were in the middle of a session, please <Link className="text-primary-100" to="/contact">let us know</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default MintPage;
