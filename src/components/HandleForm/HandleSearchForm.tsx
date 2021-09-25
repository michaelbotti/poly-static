import React, { useContext, useEffect } from 'react';

import { usePrimeMintingContext } from "../../lib/helpers/context";
import { HandleMintContext } from '../../context/handleSearch';
import { AppContext } from '../../context/app';
import { HandleSearchReserveFlow } from '../HandleSearch';
import WalletButton from '../WalletButton';
import { Loader } from '../Loader';
import NFTPreview from '../NFTPreview';

export const HandleSearchForm = () => {
  const { isConnected } = useContext(AppContext);
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
              {isConnected && <HandleSearchReserveFlow />}
              {!isConnected && primed && (
                <>
                  <p className="mt-2 text-lg">
                    In order to mint a new handle, you'll need to connect your
                    Nami wallet.
                  </p>
                  <WalletButton />
                </>
              )}
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
