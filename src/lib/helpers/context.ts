import { useContext, useEffect } from 'react';
import { onValue } from 'firebase/database';

import { AppContext } from '../../context/app';
import { HandleMintContext } from '../../context/handleSearch';
import { HEADER_APPCHECK } from '../constants';
import { getActiveSessionsRef, getReservedHandlesRef, requestToken } from '../firebase';

export const usePrimeMintingContext = async () => {
  const { setErrors } = useContext(AppContext);
  const { setReservedHandles, setCurrentSessions, setPrimed } = useContext(HandleMintContext);

  useEffect(() => {
    (async () => {
      Promise.all([
        fetch('/.netlify/functions/clean'),
        fetch('/.netlify/functions/mint'),
        fetch('/.netlify/functions/reservedHandles'),
        fetch('/.netlify/functions/search'),
        fetch('/.netlify/functions/session'),
      ]).then(values => {
        console.log(values);
      })
      .catch(e => console.log(e));

      const token = await requestToken();
      const headers = {
        [HEADER_APPCHECK]: token
      }

      // Retrieve reserved handle data store.
      const reservedHandlesRef = getReservedHandlesRef();
      onValue(reservedHandlesRef, (snapshot) => {
        if (snapshot) {
          setReservedHandles(snapshot.val())
        }
      });

      const currentSessions = getActiveSessionsRef();
      onValue(currentSessions, (snapshot) => {
        if (snapshot) {
          setCurrentSessions(snapshot.val())
        }
      });

      if (!localStorage.getItem('ADAHANDLE_IP')) {
        const { ip } = await (await fetch('/.netlify/functions/ip', { headers })).json();
        localStorage.setItem('ADAHANDLE_IP', ip);
      }

      setPrimed(true);
      // setErrors([
      //   'Something went wrong. Please refresh and try again.'
      // ]);
    })();
  }, []);
}
