import { SetStateAction, useContext, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import { HandleMintContext, ReservedHandlesType } from '../../context/mint';
import { app } from '../firebase';

export const usePrimeMintingContext = async () => {
  const { setReservedHandles, setPrimed } = useContext(HandleMintContext);

  useEffect(() => {
    (async () => {
      fetch('/.netlify/functions/queue').catch();
      fetch('/.netlify/functions/verify').catch();

      // Retrieve reserved handle data store.
      const firestore = getFirestore(app);
      const reservedHandlesCollection = collection(firestore, '/reservedHandles');
      const data = reservedHandlesCollection && await getDocs(reservedHandlesCollection);
      const value = !data.empty && data.docs.map(doc => doc?.data()) as unknown;
      value && setReservedHandles(value[0] as SetStateAction<ReservedHandlesType>);

      setPrimed(true);
    })();
  }, []);
}
