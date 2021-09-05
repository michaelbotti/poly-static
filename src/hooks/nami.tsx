import React, { useState, useEffect, useContext } from "react";

import { AppContext } from "../context/app";

export const useWalletAddress = (): [boolean, string] => {
  const [walletAddr, setWalletAddr] = useState<string | null>(null);
  const [loadingWalletAddr, setLoadingWalletAddr] = useState<boolean>(false);
  const { isConnected } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      if (isConnected) {
        setLoadingWalletAddr(true);
        const addr = await window.cardano.getUsedAddresses();
        const Buffer =
          addr.length && (await import("buffer").then(({ Buffer }) => Buffer));
        const Cardano =
          addr.length &&
          (await import("@emurgo/cardano-serialization-lib-asmjs"));

        if (Cardano && Buffer) {
          const hexString = Cardano.Address.from_bytes(
            Buffer.from(addr[0], "hex")
          );
          setWalletAddr(hexString.to_bech32());
          setLoadingWalletAddr(false);
        }
      }
    })();
  }, [isConnected]);

  return [loadingWalletAddr, walletAddr];
};
