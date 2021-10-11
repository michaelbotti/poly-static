import { useEffect, useContext } from "react";

import {
  getTwitterResponseUnvailable,
  getDefaultResponseUnvailable,
  getBetaPhaseResponseUnavailable,
  getReservedUnavailable,
  getSPOUnavailable,
} from "../helpers/search";
import { HandleResponseBody } from "../helpers/search";
import { requestToken } from "../firebase";
import {
  BETA_PHASE_MATCH,
  HEADER_APPCHECK,
  HEADER_HANDLE,
  HEADER_IP_ADDRESS,
} from "../constants";
import { HandleMintContext } from "../../context/mint";
import { normalizeNFTHandle } from "../helpers/nfts";
import { getIpAddress } from "../helpers/session";

export const useSyncAvailableStatus = async (unsanitizedHandle: string) => {
  const { setFetching, setHandleResponse, reservedHandles } =
    useContext(HandleMintContext);

  useEffect(() => {
    const handle = normalizeNFTHandle(unsanitizedHandle);

    if (handle.length === 0) {
      setHandleResponse(null);
      return;
    }

    if (reservedHandles?.manual?.includes(handle)) {
      setHandleResponse(getReservedUnavailable());
      return;
    }

    if (reservedHandles?.spos?.includes(handle)) {
      setHandleResponse(getSPOUnavailable());
      return;
    }

    if (reservedHandles?.twitter?.includes(handle)) {
      setHandleResponse(getTwitterResponseUnvailable());
      return;
    }

    if (reservedHandles?.blacklist?.includes(handle)) {
      setHandleResponse(getDefaultResponseUnvailable());
      return;
    }

    if (
      !handle.match(BETA_PHASE_MATCH) &&
      !reservedHandles?.twitter?.includes(handle)
    ) {
      setHandleResponse(getBetaPhaseResponseUnavailable());
      return;
    }

    (async () => {
      setFetching(true);
      const token = await requestToken();
      const headers: HeadersInit = {
        [HEADER_HANDLE]: handle,
        [HEADER_APPCHECK]: token,
        [HEADER_IP_ADDRESS]: await getIpAddress(),
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
