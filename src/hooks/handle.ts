import { useEffect, useContext } from 'react';

// Types
import { HandleResponseBody } from '../../src/lib/helpers/search';

// Helpers
import { requestToken } from '../lib/firebase';
import { BETA_PHASE_MATCH, HEADER_APPCHECK, HEADER_HANDLE, HEADER_IP_ADDRESS } from '../../src/lib/constants';
import { HandleMintContext } from '../../src/context/handleSearch';
import {
  getTwitterResponseUnvailable,
  getDefaultResponseUnvailable,
  getBetaPhaseResponseUnavailable
} from '../../src/lib/helpers/search';

export const useSyncAvailableStatus = async (handle: string) => {
    const { setFetching, setHandleResponse, reservedHandles } = useContext(HandleMintContext);

    useEffect(() => {
      if (handle.length === 0) {
        setHandleResponse(null);
        return;
      }

      if (reservedHandles?.twitter?.includes(handle.toLowerCase())) {
        setHandleResponse(
          getTwitterResponseUnvailable()
        );

        return;
      }

      if (
        reservedHandles?.spos?.includes(handle.toLowerCase()) ||
        reservedHandles?.manual?.includes(handle.toLocaleLowerCase())
      ) {
        setHandleResponse(
          getDefaultResponseUnvailable()
        );

        return;
      }

      if (!handle.match(BETA_PHASE_MATCH) && !reservedHandles?.twitter?.includes(handle.toLowerCase())) {
        setHandleResponse(
          getBetaPhaseResponseUnavailable()
        );

        return;
      }

      (async () => {
        setFetching(true);
        const token = await requestToken();
        const headers: HeadersInit = {
          [HEADER_HANDLE]: handle,
          [HEADER_APPCHECK]: token,
          [HEADER_IP_ADDRESS]: localStorage.getItem('ADAHANDLE_IP') || ''
        }

        // Search on-chain.
        const res: HandleResponseBody = await (
          await fetch(`/.netlify/functions/search`, { headers })
        ).json();

        // Circumvent if reserved but not yet minted.
        // const today = new Date();
        // if (res.available && reservedTwitterUsernames.includes(handle.toLocaleLowerCase()) && today < RESERVE_EXPIRE_DATE) {
        //   const day = await import('dayjs').then(module => module.default)
        //   const relativeTime = await import('dayjs/plugin/relativeTime').then(module => module.default);
        //   day.extend(relativeTime);

        //   setFetching(false);
        //   setHandleResponse({
        //     available: false,
        //     message: `Reserve status for this handle will expire ${day().to(RESERVE_EXPIRE_DATE)}.`,
        //     twitter: true
        //   });
        //   return;
        // }

        setFetching(false);
        setHandleResponse(res);
      })();
    }, [handle]);
  };
