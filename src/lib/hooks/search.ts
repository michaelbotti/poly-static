import { useEffect, useContext } from "react";

import { HandleResponseBody } from "../helpers/search";
import {
  HEADER_HANDLE,
  HEADER_IS_SPO,
} from "../constants";
import { HandleMintContext } from "../../context/mint";
import { normalizeNFTHandle } from "../helpers/nfts";
import { getAccessTokenFromCookie, getSPOAccessTokenCookie } from "../helpers/session";
import { getAccessTokenCookieName } from "../../../netlify/helpers/util";

export const useSyncAvailableStatus = async (unsanitizedHandle: string, isSpo = false) => {
  const { setFetching, setHandleResponse } =
    useContext(HandleMintContext);

  useEffect(() => {
    const handle = normalizeNFTHandle(unsanitizedHandle);

    // Don't allow new sessions when their's 5 minutes left.
    // TODO: Figure out where to say this.
    // if (Date.now() + 300000 > (currentAccess ? currentAccess.data.exp * 1000 : 0) && !reservedHandles?.twitter?.includes(handle)) {
    //   setHandleResponse({
    //     available: true,
    //     message: 'Less than 5 minutes! This attempt may be refunded.',
    //     twitter: false
    //   });
    //   return;
    // }

    if (handle.length === 0) {
      setHandleResponse(null);
      return;
    }

    (async () => {
      setFetching(true);
      const accessToken = isSpo ? getSPOAccessTokenCookie() : getAccessTokenFromCookie();

      if (!accessToken) {
        return;
      }

      const headers: HeadersInit = {
        [HEADER_HANDLE]: handle,
        [HEADER_IS_SPO]: isSpo ? 'true' : 'false',
        [getAccessTokenCookieName(isSpo)]: accessToken.token
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
