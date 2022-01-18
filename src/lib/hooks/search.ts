import { useEffect, useContext } from "react";

import {
  getBetaPhaseResponseUnavailable,
  getDefaultResponseUnvailable,
  getReservedUnavailable,
} from "../helpers/search";
import { HandleResponseBody } from "../helpers/search";
import {
  BETA_PHASE_MATCH,
  HEADER_HANDLE,
  HEADER_IS_SPO,
  HEADER_JWT_ACCESS_TOKEN,
  MAX_SESSION_LENGTH,
} from "../constants";
import { HandleMintContext } from "../../context/mint";
import { normalizeNFTHandle } from "../helpers/nfts";
import { getAccessTokenFromCookie } from "../helpers/session";

export const useSyncAvailableStatus = async (unsanitizedHandle: string, isSpo = false) => {
  const currentAccess = getAccessTokenFromCookie();
  const { setFetching, setHandleResponse, reservedHandles } =
    useContext(HandleMintContext);

  useEffect(() => {
    const handle = normalizeNFTHandle(unsanitizedHandle);

    // Don't allow new sessions when their's 5 minutes left.
    if (Date.now() + 300000 > (currentAccess ? currentAccess.data.exp * 1000 : 0) && !reservedHandles?.twitter?.includes(handle)) {
      setHandleResponse({
        available: true,
        message: 'Less than 5 minutes! This attempt may be refunded.',
        twitter: false
      });
      return;
    }

    if (handle.length === 0) {
      setHandleResponse(null);
      return;
    }

    if (!handle.match(BETA_PHASE_MATCH)) {
      setHandleResponse(getBetaPhaseResponseUnavailable());
      return;
    }

    const isReserved = isSpo ? reservedHandles?.manual.includes(handle) : reservedHandles?.manual.includes(handle) || reservedHandles?.spos.includes(handle)
    if (isReserved) {
      setHandleResponse(getReservedUnavailable());
      return;
    }

    if (reservedHandles?.blacklist.includes(handle)) {
      setHandleResponse(getDefaultResponseUnvailable());
      return;
    }

    (async () => {
      setFetching(true);
      const accessToken = getAccessTokenFromCookie();

      if (!accessToken) {
        return;
      }

      const headers: HeadersInit = {
        [HEADER_HANDLE]: handle,
        [HEADER_IS_SPO]: isSpo ? 'true' : 'false',
        [HEADER_JWT_ACCESS_TOKEN]: accessToken.token
      };

      // Search on-chain.
      const res: HandleResponseBody = await (
        await fetch(`/.netlify/functions/search`, { headers })
      ).json();

      setFetching(false);
      setHandleResponse(res);
    })();
  }, [unsanitizedHandle]);
};
