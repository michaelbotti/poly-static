export type RarityType = 'Legendary' | 'Ultra Rare' | 'Rare' | 'Common';

export const useRaritySlug = (handle: string): RarityType => {
    if (1 === handle.length) {
        return 'Legendary';
    }
    
    if (handle.length > 1 && handle.length < 4) {
        return 'Ultra Rare';
    } 
    
    if (handle.length > 3 && handle.length < 8) {
        return 'Rare';
    }

    return 'Common';
}

export type RarityColorTypes = "white" | "blue" | "green" | "red";

export const useRarityColor = (handle: string): RarityColorTypes => {
    if (1 === handle.length) {
        return 'white';
    }
    
    if (handle.length > 1 && handle.length < 4) {
        return 'green';
    } 
    
    if (handle.length > 3 && handle.length < 8) {
        return 'blue';
    }

    return 'white';
}

export type RarityHexTypes = 'rgba(255,255,255,.2)' | '#ffffff' | '#48ACF0' | '#0CD15B' | '#DF3737';

export const useRarityHex = (handle: string): RarityHexTypes => {
    if (0 === handle.length) {
        return 'rgba(255,255,255,.2)';
    }

    if (1 === handle.length) {
        return '#DF3737';
    }
    
    if (handle.length > 1 && handle.length < 4) {
        return '#0CD15B';
    } 
    
    if (handle.length > 3 && handle.length < 8) {
        return '#48ACF0';
    }

    return '#ffffff';
}

export type RarityCostTypes = 500 | 250 | 100 | 10;

export const useRarityCost = (handle: string): RarityCostTypes => {
    if (1 === handle.length) {
        return 500;
    }
    
    if (handle.length > 1 && handle.length < 4) {
        return 250;
    } 
    
    if (handle.length > 3 && handle.length < 8) {
        return 100;
    }

    return 10;
}