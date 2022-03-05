import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StateResponseBody } from "../../../netlify/functions/state";
import { useIsTestnet } from "../../lib/hooks/useIsTestnet";

import Button from "../button";

export const DynamicPricing = () => {
  const [stateData, setStateData] = useState(null);
  const [stateLoading, setStateLoading] = useState(false);

  const { isTestnet } = useIsTestnet();

  const fetchDynamicPricing = async () => {
    setStateData(null);
    setStateLoading(true);
    await fetch("/.netlify/functions/state")
      .then(async (res) => {
        const data: StateResponseBody = await res.json();
        setStateData(data);
      })
      .catch((e) => {
        setStateData(null);
      })
      .finally(() => {
        setStateLoading(false);
      });
  };

  useEffect(() => {
    fetchDynamicPricing();
  }, []);

  const renderDynamicPricing = (option: string) => {
    return (
      <strong>
        {!stateLoading && stateData?.handlePrices ? (
          <span>
            {stateData?.handlePrices[option]} {isTestnet ? "t₳" : "₳"}
          </span>
        ) : (
          <CircularProgress size={10} />
        )}
      </strong>
    );
  };

  return (
    <>
      <ul>
        <li>
          Legendary (1 character): <strong>Auction Only</strong>
        </li>
        <li>Ultra Rare (2 characters): {renderDynamicPricing("ultraRare")}</li>
        <li>Rare (3 characters): {renderDynamicPricing("rare")}</li>
        <li>Common (4–7): {renderDynamicPricing("common")}</li>
        <li>Basic (8–15): {renderDynamicPricing("basic")}</li>
      </ul>
      <br />
      <Button animate onClick={() => fetchDynamicPricing()} size="small">
        Refresh Prices
      </Button>
    </>
  );
};
