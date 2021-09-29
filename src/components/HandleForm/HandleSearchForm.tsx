import React, { useContext, useEffect } from 'react';

import { usePrimeMintingContext } from "../../lib/helpers/context";
import { HandleMintContext } from '../../context/mint';
import { HandleSearchReserveFlow } from '../HandleSearch';
import { Loader } from '../Loader';
import NFTPreview from '../NFTPreview';

export const HandleSearchForm = () => {
  const { primed, handle } = useContext(HandleMintContext);

  usePrimeMintingContext();

  return (
    <section id="top">
      <div
        className="grid grid-cols-12 bg-dark-200 rounded-lg place-content-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="col-span-12 lg:col-span-6 relative z-10">
          {primed ? (
            <div className="p-8">
              <HandleSearchReserveFlow />
            </div>
          ) : (
            <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
              <p className="w-full text-center">Fetching bytes...</p>
              <Loader />
            </div>
          )}
        </div>
        <div className="col-span-12 lg:col-span-6 py-8">
          <NFTPreview handle={handle} />
        </div>
      </div>
    </section>
  );
};
