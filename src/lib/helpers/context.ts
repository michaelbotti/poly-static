import { useContext, useEffect } from 'react';
import { get, child } from 'firebase/database';

import { HandleMintContext } from '../../context/mint';
import { getReservedHandlesRef } from '../firebase';

export const usePrimeMintingContext = async () => {
  const { setReservedHandles, setPrimed } = useContext(HandleMintContext);

  useEffect(() => {
    (async () => {
      Promise.all([
        fetch('/.netlify/functions/search').catch(),
        fetch('/.netlify/functions/session').catch(),
      ]).catch(e => console.log(e));

      // Retrieve reserved handle data store.
      const reservedHandlesRef = getReservedHandlesRef();
      const reservedHandlesRes = await (await get(child(reservedHandlesRef, '/'))).val();
      reservedHandlesRes && setReservedHandles(reservedHandlesRes);

      setPrimed(true);
    })();
  }, []);
}
