import React from "react";

export const MintingClosed = () => {
  return (
    <section id="top" className="max-w-5xl mx-auto">
      <div
        className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-center p-4 lg:p-8"
        style={{ minHeight: "60vh" }}
      >
        <div className="col-span-12 md:col-span-6 md:col-start-4 relative z-10">
          <h2 className="text-5xl text-center text-primary-200 mt-auto w-full">
            <span className="font-bold text-white">Minting will open at 5PM UTC.</span>
            <br />
          </h2>
          <p className="text-lg text-dark-350 text-center mt-4">
            See you then!
          </p>
        </div>
      </div>
    </section>
  );
};
