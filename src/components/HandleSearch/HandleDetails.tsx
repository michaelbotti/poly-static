import React from "react";
import { useContext } from "react";
import { HandleMintContext } from "../../context/handleSearch";
import { useRarityCost, useRarityHex, useRaritySlug } from "../../hooks/nft";

export const HandleDetails = (): JSX.Element => {
  const { handle } = useContext(HandleMintContext);
  const hex = useRarityHex(handle);
  const slug = useRaritySlug(handle);
  const cost = useRarityCost(handle);

  return (
    <h4 className="text-xl">
      {handle.length === 0 ? (
        <span className="font-bold text-xl">Rarity / Price</span>
      ) : (
        <span className="font-bold text-xl">
          <span style={{ color: hex }}>{slug}</span> / {cost} ₳
        </span>
      )}
    </h4>
  );
};
