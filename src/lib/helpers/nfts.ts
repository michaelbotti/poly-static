export type RarityType = "Legendary" | "Ultra Rare" | "Rare" | "Common";
export type RarityColorTypes = "white" | "blue" | "green" | "red";
export type RarityCostTypes = 750 | 450 | 100 | 10;
export type RarityHexTypes = "#ffffff" | "#48ACF0" | "#0CD15B" | "#DF3737";

export const normalizeNFTHandle = (handle: string): string => handle.toLowerCase();

export const getRarityFromLength = (length: number): RarityType => {
    if (1 === length || 2 === length) {
        return 'Legendary';
    }

    if (2 < length && 6 > length) {
        return 'Ultra Rare';
    }

    if (5 < length && 10 > length) {
        return 'Rare';
    }

    return 'Common';
}

export const getRaritySlug = (handle: string): RarityType =>
  getRarityFromLength(handle.length);

export const getRarityColor = (handle: string): RarityColorTypes => {
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

export const getRarityHex = (handle: string): RarityHexTypes => {
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

export const getRarityCost = (handle: string): RarityCostTypes => {
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
