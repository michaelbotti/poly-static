import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { HandleMintContext } from "../context/handleSearch";
import { HandleAvailableResponseGETBody } from "../functions/handle";
import { getRarityFromLength } from "../lib/helpers/nfts";

export type RarityType = "Legendary" | "Ultra Rare" | "Rare" | "Common";
export type RarityColorTypes = "white" | "blue" | "green" | "red";
export type RarityCostTypes = 500 | 250 | 100 | 10;
export type RarityHexTypes = "#ffffff" | "#48ACF0" | "#0CD15B" | "#DF3737";

export const useRaritySlug = (handle: string): RarityType =>
  getRarityFromLength(handle.length);

export const useRarityColor = (handle: string): RarityColorTypes => {
  const rarity = getRarityFromLength(handle.length);
  switch (rarity) {
    case "Legendary":
      return "red";
    case "Ultra Rare":
      return "green";
    case "Rare":
      return "blue";
    default:
    case "Common":
      return "white";
  }
};

export const useRarityHex = (handle: string): RarityHexTypes => {
  const rarity = getRarityFromLength(handle.length);
  switch (rarity) {
    case "Legendary":
      return "#DF3737";
    case "Ultra Rare":
      return "#0CD15B";
    case "Rare":
      return "#48ACF0";
    default:
    case "Common":
      return "#ffffff";
  }
};

export const useRarityCost = (handle: string): RarityCostTypes => {
  const rarity = getRarityFromLength(handle.length);
  switch (rarity) {
    case "Legendary":
      return 500;
    case "Ultra Rare":
      return 250;
    case "Rare":
      return 100;
    case "Common":
      return 10;
  }
};

export const useCheckIfAvailable = async (debouncedHandle: string) => {
  const { setFetching, setHandleResponse } = useContext(HandleMintContext);

  useEffect(() => {
    if (debouncedHandle.length === 0) {
      setHandleResponse(null);
      return;
    }

    (async () => {
      setFetching(true);
      
      const res: HandleAvailableResponseGETBody = await (
        await fetch(`/.netlify/functions/handle`, {
          headers: {
            "x-handle": debouncedHandle,
          },
        })
      ).json();

      setFetching(false);
      setHandleResponse(res);
    })();
  }, [debouncedHandle]);
};
