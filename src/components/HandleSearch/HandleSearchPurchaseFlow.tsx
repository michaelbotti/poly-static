import React, { useContext } from "react";
import { HandleMintContext } from "../../../src/context/handleSearch";
import ReactCountdown from "react-countdown";

import { RESERVE_SESSION_LENGTH } from "../../../src/lib/constants";
import Button from "../button";
import { getRarityCost, getRarityHex, getRaritySlug } from '../../../src/lib/helpers/nfts';

export const HandleSearchPurchaseFlow = () => {
  const { isPurchasing, twitter, handle } = useContext(HandleMintContext);
  const cost = getRarityCost(handle);
  const rarity = getRaritySlug(handle);
  const color = getRarityHex(handle);

  if (!isPurchasing) {
    return null;
  }

  const handleOnClick = async (e) => {
    e.preventDefault();
    const token = await window.grecaptcha
      .execute("6Ld0QUkcAAAAAN-_KvCv8R_qke8OYxotNJzIg2RP", { action: "submit" })
      .then((token: string) => token);
    const headers = {
      "x-recaptcha": token,
    };

    if (twitter?.user) {
      headers["x-twitter-credentials"] = JSON.stringify(twitter.credentials);
    }

    const res = await fetch("/.netlify/functions/mint", {
      method: "POST",
      headers,
    });
  };

  return (
    <>
      <h2 className="font-bold text-4xl mb-2">
        Session expires in{" "}
        <ReactCountdown
          date={Date.now() + RESERVE_SESSION_LENGTH}
          renderer={({ minutes, seconds }) => (
            <strong>
              {minutes}:{seconds}
            </strong>
          )}
        />
      </h2>
      <p className="text-sm">
        <span style={{ color: "orange" }}>
          <strong>DO NOT close this window.</strong>
        </span>{" "}
        Your session has started and no one can initiate this mint except you. If you
        close the window, you'll need to wait for the session to expire before
        retrying.
      </p>
      <hr className="w-12 border-dark-300 border-2 block my-8" />
      <h5 className="text-2xl font-bold mb-4">
        <span style={{ color }}>{rarity}</span>: {cost} ₳
      </h5>
      <Button
        onClick={handleOnClick}
        className="bg-primary-200 text-dark-100 hover:text-white"
        internal={true}
      >
        Purchase with Nami Wallet
      </Button>
    </>
  );
};

export default HandleSearchPurchaseFlow;
