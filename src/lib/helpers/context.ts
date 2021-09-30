import { useContext, useEffect } from 'react';
import { onValue } from 'firebase/database';

import { HandleMintContext } from '../../context/mint';
import { HEADER_APPCHECK } from '../constants';
import { getReservedHandlesRef, requestToken } from '../firebase';
import gql from 'graphql-tag';

export const useSyncChainLoad = async () => {
  const { setChainLoad } = useContext(HandleMintContext);
  useEffect(() => {
    const updateChainLoadJob = async () => {
      const token = await requestToken();
      const { access } = await fetch('/.netlify/functions/access', {
        headers: {
          [HEADER_APPCHECK]: token,
        }
      }).then(res => res.json());

      setChainLoad(access);
    };

    updateChainLoadJob();

    // setTimeout(updateChainLoadJob, 3000); // 3 seconds
    // setInterval(updateChainLoadJob, 300000); // 5 minutes
  }, []);
}

export const usePrimeMintingContext = async () => {
  const { setReservedHandles, setPrimed } = useContext(HandleMintContext);

  useEffect(() => {
    (async () => {
      const token = await requestToken();
      const headers = {
        [HEADER_APPCHECK]: token
      }

      Promise.all([
        fetch('/.netlify/functions/clean', { headers }).catch(),
        fetch('/.netlify/functions/mint').catch(),
        fetch('/.netlify/functions/reservedHandles').catch(),
        fetch('/.netlify/functions/search').catch(),
        fetch('/.netlify/functions/session').catch(),
      ]).catch(e => console.log(e));

      // Retrieve reserved handle data store.
      const reservedHandlesRef = getReservedHandlesRef();
      onValue(reservedHandlesRef, (snapshot) => {
        if (snapshot) {
          setReservedHandles(snapshot.val())
        }
      });

      if (!localStorage.getItem('ADAHANDLE_IP')) {
        const { ip } = await (await fetch('/.netlify/functions/ip', { headers })).json();
        localStorage.setItem('ADAHANDLE_IP', ip);
      }

      setPrimed(true);
    })();
  }, []);
}
