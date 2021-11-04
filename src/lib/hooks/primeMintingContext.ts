import { SetStateAction, useContext, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import { HandleMintContext, ReservedHandlesType } from '../../context/mint';
import { app } from '../firebase';
import { useAccessOpen } from './access';
import { HEADER_JWT_ACCESS_TOKEN } from '../constants';
import { getAccessTokenFromCookie } from '../helpers/session';

export const usePrimeMintingContext = async () => {
  const { setReservedHandles, setPrimed, reservedHandles } = useContext(HandleMintContext);
  const [accessOpen] = useAccessOpen();

  useEffect(() => {
    (async () => {
      fetch('/.netlify/functions/queue').catch();
      fetch('/.netlify/functions/verify').catch();

      const accessToken = getAccessTokenFromCookie();
      if (accessOpen && accessToken && !reservedHandles) {
        const value = await fetch('/.netlify/functions/reservedHandles', {
          headers: {
            [HEADER_JWT_ACCESS_TOKEN]: accessToken
          }
        }).then(res => res.json());

        value && setReservedHandles(value.data as SetStateAction<ReservedHandlesType>);
      }

      setPrimed(true);
    })();
  }, [accessOpen]);
}
