import { RarityType } from "../../hooks/nft";

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