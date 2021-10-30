import { useEffect, useContext } from "react";

import {
  getDefaultActiveSessionUnvailable,
  getBetaPhaseResponseUnavailable,
  getTwitterResponseUnvailable,
  getDefaultResponseUnvailable,
  getDefaultResponseAvailable,
  getReservedUnavailable,
} from "../helpers/search";
import { HandleResponseBody } from "../helpers/search";
import {
  BETA_PHASE_MATCH,
  HEADER_HANDLE,
  HEADER_JWT_ACCESS_TOKEN,
} from "../constants";
import { HandleMintContext } from "../../context/mint";
import { normalizeNFTHandle } from "../helpers/nfts";
import { getAccessTokenFromCookie } from "../helpers/session";

export const useSyncAvailableStatus = async (unsanitizedHandle: string) => {
  const { setFetching, setHandleResponse, reservedHandles } =
    useContext(HandleMintContext);

  useEffect(() => {
    const handle = normalizeNFTHandle(unsanitizedHandle);

    if (handle.length === 0) {
      setHandleResponse(null);
      return;
    }

    if (!handle.match(BETA_PHASE_MATCH)) {
      setHandleResponse(getBetaPhaseResponseUnavailable());
      return;
    }

    if (reservedHandles?.manual.includes(handle) || reservedHandles?.spos.includes(handle)) {
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
      const headers: HeadersInit = {
        [HEADER_HANDLE]: handle,
        [HEADER_JWT_ACCESS_TOKEN]: accessToken
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
