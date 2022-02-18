import React, { FC } from "react";
import {
  getRarityCost,
  getRarityHex,
  getRaritySlug,
} from "../../../src/lib/helpers/nfts";
import { SPO_ADA_HANDLE_COST } from "../../lib/constants";

interface HandleDetailProps {
  handle: string;
  isSpo?: boolean;
}

export const HandleDetails: FC<HandleDetailProps> = ({
  handle,
  isSpo = false,
}): JSX.Element => {
  const hex = getRarityHex(handle);
  const slug = getRaritySlug(handle);
  const cost = isSpo ? SPO_ADA_HANDLE_COST : getRarityCost(handle);

  return (
    <h4 className="text-xl">
      {handle.length === 0 ? (
        <span className="text-xl">Rarity / Price</span>
      ) : (
        <span className="font-bold text-xl">
          <span style={{ color: hex }}>{slug}</span> /{" "}
          {cost ? `${cost} ₳` : "Auction Only"}
        </span>
      )}
    </h4>
  );
};
