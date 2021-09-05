import React, { useMemo, useContext, useCallback } from "react";

import { AppContext } from "../../context/app";
import { useWalletAddress } from "../../hooks/nami";
import Button from "../button";

const WalletButton = (): JSX.Element => {
  const { isConnected, setIsConnected, setErrors } = useContext(AppContext);
  const [loadingWalletAddr, walletAddr] = useWalletAddress();

  const buttonText = useMemo(() => {
    if (isConnected && loadingWalletAddr) {
      return "Decoding...";
    }

    if (isConnected && !loadingWalletAddr) {
      return walletAddr;
    }

    if (!isConnected && !loadingWalletAddr) {
      return "Connect";
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
      className={`${isConnected && walletAddr ? 'cursor-not-allowed' : ''} w-48 overflow-hidden whitespace-nowrap overflow-ellipsis dark:bg-dark-100 text-dark-300`}
      disabled={isConnected}
      onClick={isConnected ? handleConnect : () => {}}
    >
      {buttonText}
    </Button>
  );
};

export default WalletButton;
