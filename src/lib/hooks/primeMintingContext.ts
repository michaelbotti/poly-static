import { getApp } from 'firebase/app';
import { get, onValue } from 'firebase/database'
import { useContext, useEffect } from 'react';

import { HandleMintContext } from '../../context/mint';
import { getReservedHandlesRef, getPendingSessionsRef } from '../firebase';

export const usePrimeMintingContext = async () => {
  const { setReservedHandles, setPendingSessions, setPrimed } = useContext(HandleMintContext);

  useEffect(() => {
    (async () => {
      try {
        Promise.all([
          fetch('/.netlify/functions/search').catch(),
          fetch('/.netlify/functions/session').catch(),
        ]).catch(e => console.log(e));

        // Retrieve reserved handle data store.
        const reservedHandlesRef = getReservedHandlesRef();
        const reservedHandlesRes = await get(reservedHandlesRef).then(res => res.val());
        reservedHandlesRes && setReservedHandles(reservedHandlesRes);

        setPrimed(true);
      } catch (e) {
        console.log(e);
      }
    })();

    // Stay in sync with active sessions.
    const pendingSessionsRef = getPendingSessionsRef();
    const unsubscribePending = onValue(pendingSessionsRef, (snapshot) => {
      if (!snapshot) {
        return;
      }

      setPendingSessions(snapshot.val());
    });

    return unsubscribePending;
  }, []);
}
