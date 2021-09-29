import { useEffect, useContext } from "react";

import {
  getTwitterResponseUnvailable,
  getDefaultResponseUnvailable,
  getBetaPhaseResponseUnavailable,
} from "../../../src/lib/helpers/search";
import { HandleResponseBody } from "../../../src/lib/helpers/search";
import { requestToken } from "../../lib/firebase";
import {
  BETA_PHASE_MATCH,
  HEADER_APPCHECK,
  HEADER_HANDLE,
  HEADER_IP_ADDRESS,
} from "../../../src/lib/constants";
import { HandleMintContext } from "../../context/mint";

export const useSyncAvailableStatus = async (handle: string) => {
  const { setFetching, setHandleResponse, reservedHandles } =
    useContext(HandleMintContext);

  useEffect(() => {
    if (handle.length === 0) {
      setHandleResponse(null);
      return;
    }

    if (reservedHandles?.twitter?.includes(handle.toLowerCase())) {
      setHandleResponse(getTwitterResponseUnvailable());

      return;
    }

    if (
      reservedHandles?.spos?.includes(handle.toLowerCase()) ||
      reservedHandles?.manual?.includes(handle.toLocaleLowerCase())
    ) {
      setHandleResponse(getDefaultResponseUnvailable());

      return;
    }

    if (
      !handle.match(BETA_PHASE_MATCH) &&
      !reservedHandles?.twitter?.includes(handle.toLowerCase())
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
        [HEADER_IP_ADDRESS]: localStorage.getItem("ADAHANDLE_IP") || "",
      };

      // Search on-chain.
      const res: HandleResponseBody = await (
        await fetch(`/.netlify/functions/search`, { headers })
      ).json();

      setFetching(false);
      setHandleResponse(res);
    })();
  }, [handle]);
};
