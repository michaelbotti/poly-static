import { CircularProgress } from "@mui/material";
import React, { FC } from "react";
import { getRarityHex, getRaritySlug } from "../../../src/lib/helpers/nfts";
import { Loader } from "../Loader";

interface HandleDetailProps {
  handle: string;
  isSpo?: boolean;
  cost?: number;
  fetching: boolean;
  isTestnet?: boolean;
}

export const HandleDetails: FC<HandleDetailProps> = ({
  handle,
  cost,
  fetching,
  isTestnet = false,
}): JSX.Element => {
  const hex = getRarityHex(handle);
  const slug = getRaritySlug(handle);

  const auctionText = slug === "Legendary" ? "Auction Only" : "Unavailable";

  return (
    <h4 className="text-xl">
      {handle.length === 0 ? (
        <span className="text-xl">Rarity / Price</span>
      ) : (
        <span className="font-bold text-xl">
          {fetching ? (
            <CircularProgress size={20} thickness={5} />
          ) : (
            <>
              <span style={{ color: hex }}>{slug}</span> /{" "}
              <span>
                {cost ? `${cost} ${isTestnet ? "t₳" : "₳"}` : auctionText}
              </span>
            </>
          )}
        </span>
      )}
    </h4>
  );
};
