import React from 'react';

import SEO from "../components/seo";

function MintPage() {
  return (
    <>
      <SEO title="Home" />
      <section id="top" className="h-screen z-0 relative" style={{
        maxHeight: '700px',
        minHeight: '480px'
      }}>
        <div className="grid grid-cols-12 content-center">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3 relative z-10 border border-primary-200 bg-dark-100 rounded-lg shadow-lg">
              <div className="p-8">
                <h2 className="font-bold text-center text-2xl">Mint Your Handle</h2>
                <hr className="w-12 border-2 border-dark-300 my-10 mx-auto" />
                <form action="" className="flex flex-col">
                    <label htmlFor="" className="form-label mb-4 text-dark-300">Choose a handle:</label>
                    <input type="text" className="form-input bg-dark-200 border-dark-300 rounded-lg p-6 text-3xl" placeholder="example" />
                    <input type="button" value="Submit" className="form-input bg-primary-200 rounded-lg p-6 w-full mt-8 font-bold text-dark-100" />
                </form>
              </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MintPage;
