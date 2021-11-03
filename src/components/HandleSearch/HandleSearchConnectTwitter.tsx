import React, { useContext, useState } from "react";
import { HandleMintContext } from "../../context/mint";

import { useTwitter } from "../../lib/hooks/twitter";

export const HandleSearchConnectTwitter = () => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const { setHandleResponse } = useContext(HandleMintContext);
  const [checkHandleAgainstUser] = useTwitter();

  return (
    <button
      className={`cursor-pointer bg-primary-100 text-white form-input rounded-lg p-6 w-full mt-12 font-bold text-dark-100`}
      onClick={async (e) => {
        e.preventDefault();
        setIsConnecting(true);
        const matches = await checkHandleAgainstUser();
        const res = matches
          ? {
              available: true,
              message: "Successfully unlocked!",
              twitter: true,
            }
          : {
              available: false,
              message: "Whoops! That Twitter account doesn't match.",
              twitter: true,
            };

        setIsConnecting(false);
        setHandleResponse(res);
      }}
    >
      {!isConnecting ? (
        <>Unlock with Twitter</>
      ) : (
        <>Authenticating your reserved handle...</>
      )}
    </button>
  );
};
