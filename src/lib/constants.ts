export const RESERVED_HANDLES = [
    'cardanodan',
    'dan',
    'ape',
    'calvin',
    'conrad',
    'mrgoose',
    'goose'
];

/**
 * a-z
 * 0-9
 * _
 * -
 */
export const ALLOWED_CHAR = new RegExp(/^[a-zA-Z|0-9|\-|\_]*$/g);

/**
 * Must match all:
 * - 3 characters or more
 */
export const BETA_PHASE_MATCH: RegExp = new RegExp(/.{3,}/g);