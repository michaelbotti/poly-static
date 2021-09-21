const RESPONSE_UNAVAILABLE_DEFAULT = 'Sorry! This handle is unavailable.';
const RESPONSE_AVAILABLE_DEFAULT = 'Yay! This handle is available.';
const RESPONSE_BETA_PHASE_UNAVAILABLE = 'Beta launch handles must be 4+ characters.';
const RESPONSE_ACTIVE_SESSION_UNAVAILABLE = 'Sorry! This handle is being purchased.';
const RESPONSE_SESSION_COUNT_UNAVAILABLE = 'Sorry! You can only have 3 active sessions at a time.';

export interface HandleResponseBody {
  available: boolean;
  message: string;
  twitter: boolean;
  link?: string;
}

export const getDefaultResponseAvailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_AVAILABLE_DEFAULT,
  available: true,
  twitter: false,
  link
});

export const getDefaultResponseUnvailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_UNAVAILABLE_DEFAULT,
  available: false,
  twitter: false,
  link
});

export const getTwitterResponseAvailable = (link?: string): HandleResponseBody => ({
    message: RESPONSE_AVAILABLE_DEFAULT,
    available: true,
    twitter: true,
    link
});

export const getTwitterResponseUnvailable = (link?: string): HandleResponseBody => ({
    message: RESPONSE_UNAVAILABLE_DEFAULT,
    available: false,
    twitter: true,
    link
});

export const getBetaPhaseResponseUnavailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_BETA_PHASE_UNAVAILABLE,
  available: false,
  twitter: false,
  link
})

export const getActiveSessionUnavailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_ACTIVE_SESSION_UNAVAILABLE,
  available: false,
  twitter: false,
  link
});

export const getSessionCountUnavailable = (link?: string): HandleResponseBody => ({
  message: RESPONSE_SESSION_COUNT_UNAVAILABLE,
  available: false,
  twitter: false,
  link
});
