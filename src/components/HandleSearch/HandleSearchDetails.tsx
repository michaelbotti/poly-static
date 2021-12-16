import React, { FC } from "react";
import { useContext } from "react";
import { HandleMintContext } from "../../context/mint";
import { getRarityCost, getRarityHex, getRaritySlug } from '../../../src/lib/helpers/nfts';

interface HandleDetailProps {
  handle: string;
}

export const HandleDetails: FC<HandleDetailProps> = ({ handle }): JSX.Element => {
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
