import React, { useEffect, useState } from "react";
import { useLocation } from "@reach/router";

export const useIsTestnet = () => {
  const [isTestnet, setIsTestnet] = useState<boolean>(false);

  const { hostname } = useLocation();

  useEffect(() => {
    if (hostname.includes("testnet") || hostname.includes("localhost")) {
      setIsTestnet(true);
    }
  }, [hostname]);

  return {
    isTestnet,
  };
};
