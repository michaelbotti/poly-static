import React, { useEffect, useContext } from "react";

import { RESERVE_EXPIRE_DATE } from "../lib/constants";
import { HandleMintContext } from "../context/handleSearch";
import { HandleResponseBody } from "../functions/handle";
import { getRarityFromLength } from "../lib/helpers/nfts";

export type RarityType = "Legendary" | "Ultra Rare" | "Rare" | "Common";
export type RarityColorTypes = "white" | "blue" | "green" | "red";
export type RarityCostTypes = 750 | 450 | 100 | 10;
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
      return 750;
    case "Ultra Rare":
      return 450;
    case "Rare":
      return 100;
    case "Common":
      return 10;
  }
};

export const useCheckIfAvailable = async (handle: string) => {
  const { setFetching, setHandleResponse, currentSessions, reservedTwitterUsernames } = useContext(HandleMintContext);  

  useEffect(() => {
    if (handle.length === 0) {
      setHandleResponse(null);
      return;
    }

    (async () => {
      setFetching(true);

      const headers: HeadersInit = {
        "x-handle": handle,
      }
      
      const res: HandleResponseBody = await (
        await fetch(`/.netlify/functions/handle`, { headers })
      ).json();

      // Circumvent if reserved but not yet minted.
      // const today = new Date();
      // if (res.available && reservedTwitterUsernames.includes(handle.toLocaleLowerCase()) && today < RESERVE_EXPIRE_DATE) {
      //   const day = await import('dayjs').then(module => module.default)
      //   const relativeTime = await import('dayjs/plugin/relativeTime').then(module => module.default);
      //   day.extend(relativeTime);

      //   setFetching(false);
      //   setHandleResponse({
      //     available: false,
      //     message: `Reserve status for this handle will expire ${day().to(RESERVE_EXPIRE_DATE)}.`,
      //     twitter: true
      //   });
      //   return;
      // }

      setFetching(false);
      setHandleResponse(res);
    })();
  }, [handle]);
};
