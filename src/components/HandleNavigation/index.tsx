import React, { useContext } from 'react';
import { HandleMintContext } from '../../context/mint';
import { getAllCurrentSessionData } from '../../lib/helpers/session';
import { useAccessOpen } from '../../lib/hooks/access';

export const HandleNavigation = () => {
  const { setCurrentIndex, currentIndex } = useContext(HandleMintContext);
  const [accessOpen] = useAccessOpen();

  const paymentSessions = getAllCurrentSessionData();
  if (!accessOpen) {
    return null;
  }

  return (
    <div className="flex justify-start place-content-center relative">
      <div className={`absolute bg-primary-100 w-8 h-8 flex items-center justify-center rounded-full -top-2 -left-2 z-10`}>
        {3 - paymentSessions.filter(sesh => false !== sesh).length}
      </div>
      <button
        onClick={() => setCurrentIndex(0)}
        className={`${currentIndex !== 0 ? 'opacity-40' : ''} bg-dark-200 flex-inline items-center justify-center px-4 py-2 rounded-t-lg mr-4 relative`}
      >
        <h4 className="text-lg p-4">Mint a Handle!</h4>
      </button>
      {paymentSessions.map((session, index) => {
        if (!session) {
          return null;
        }

        return (
          <button
            key={index}
            onClick={() => setCurrentIndex(index + 1)}
            className={`${index + 1 !== currentIndex ? `bg-dark-100 opacity-60` : `bg-dark-200`} flex-inline items-center justify-center px-8 lg:px-4 py-2 rounded-t-lg mr-4`}
          >
            <h4 className="hidden lg:block">${session.data.handle}</h4>
            <h4 className="lg:hidden font-bold">{index}</h4>
          </button>
        )
      })}
    </div>
  )
}
