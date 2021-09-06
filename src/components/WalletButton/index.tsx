import React, { useMemo, useContext, useCallback } from "react";

import { AppContext } from "../../context/app";
import { useWalletAddress } from "../../hooks/nami";
import Button from "../button";

const WalletButton = (): JSX.Element => {
  const { isConnected, setIsConnected, setErrors } = useContext(AppContext);
  const [loadingWalletAddr, walletAddr] = useWalletAddress();

  const [buttonText, buttonClasses] = useMemo(() => {
      let baseClass = 'w-48 overflow-hidden whitespace-nowrap overflow-ellipsis';
    if (isConnected && loadingWalletAddr) {
      return ["Loading...", `${baseClass} cursor-not-allowed hover:shadow-none dark:bg-dark-100 text-dark-300`];
    }

    if (isConnected && !loadingWalletAddr) {
      return [walletAddr, `${baseClass} cursor-not-allowed hover:shadow-none dark:bg-dark-100 text-dark-300`];
    }

    if (!isConnected && !loadingWalletAddr) {
      return ["Connect", `${baseClass} bg-primary-100 text-white hover:bg-primary-200`];
    }
  }, [isConnected, walletAddr, loadingWalletAddr]);

  const handleConnect = useCallback(() => {
    (async () => {
      try {
        const isConnected = await window.cardano.enable();
        setIsConnected(isConnected);
      } catch ({ code, info }) {
        if (code) {
          setErrors([info]);
          setTimeout(() => {
            setErrors([]);
          }, 5000);
        }
      }
    })();
  }, [isConnected]);

  return (
    <Button
      className={buttonClasses}
      disabled={isConnected}
      onClick={!isConnected ? handleConnect : () => {}}
    >
      {buttonText}
    </Button>
  );
};

export default WalletButton;
