import React from "react";
import { useContext } from "react";
import { HandleMintContext } from "../../context/mint";
import { getRarityCost, getRarityHex, getRaritySlug } from '../../../src/lib/helpers/nfts';

export const HandleDetails = (): JSX.Element => {
  const { handle } = useContext(HandleMintContext);
  const hex = getRarityHex(handle);
  const slug = getRaritySlug(handle);
  const cost = getRarityCost(handle);

  return (
    <h4 className="text-xl">
      {handle.length === 0 ? (
        <span className="text-xl">Rarity / Price</span>
      ) : (
        <span className="font-bold text-xl">
          <span style={{ color: hex }}>{slug}</span> / {cost ? `${cost} ₳` : 'Auction Only'}
        </span>
      )}
    </h4>
  );
};
