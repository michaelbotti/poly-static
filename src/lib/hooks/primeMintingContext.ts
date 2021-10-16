import { useContext, useEffect } from 'react';
import { get, child, onValue } from 'firebase/database';

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
        const reservedHandlesRes = await (await get(child(reservedHandlesRef, '/'))).val();
        reservedHandlesRes && setReservedHandles(reservedHandlesRes);

        setPrimed(true);

        // Stay in sync with active sessions.
        const pendingSessionsRef = getPendingSessionsRef();
        const unsubscribePending = onValue(pendingSessionsRef, (snapshot) => {
          if (!snapshot) {
            return;
          }

          setPendingSessions(snapshot.val());
        });

        return unsubscribePending;
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
}
