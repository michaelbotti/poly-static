import React, { useEffect, useState } from "react";
import { QueuePositionResponseBody } from "../../../netlify/functions/mintingQueuePosition";
import { fetchAuthenticatedRequest } from "../../../netlify/helpers/fetchAuthenticatedRequest";
import {
  HEADER_IS_SPO,
  HEADER_JWT_ALL_SESSIONS_TOKEN,
} from "../../lib/constants";
import { getAllCurrentSessionCookie } from "../../lib/helpers/session";

export const HandleStatus = () => {
  const [mintingQueuePositionResponse, setMintingQueuePositionResponse] =
    useState(null);
  const [error, setError] = useState<boolean>(false);
  //useEffect(() => {

  //     const allSessionsCookie = getAllCurrentSessionCookie();
  //     if (!accessToken || !allSessionsCookie || !validPayment) {
  //       return;
  //     }

  //     const controller = new AbortController();
  //     const updateMintingQueuePosition = async () => {
  //       await fetchAuthenticatedRequest<QueuePositionResponseBody>(
  //         `/.netlify/functions/mintingQueuePosition`,
  //         {
  //           signal: controller.signal,
  //           headers: {
  //             [HEADER_IS_SPO]: isSPO ? "true" : "false",
  //             [HEADER_JWT_ALL_SESSIONS_TOKEN]: allSessionsCookie.token,
  //           },
  //         },
  //         isSPO
  //       )
  //         .then((res) => {
  //           if (!res.error) {
  //             setMintingQueuePosition(res.mintingQueuePosition);
  //             setMintingQueueMinutes(res.minutes);
  //             setFetchingMintingQueuePosition(false);
  //             return;
  //           }

  //           setError(true);
  //           setFetchingMintingQueuePosition(false);
  //         })
  //         .catch((e) => {});
  //     };

  //     updateMintingQueuePosition();
  //     const interval = setInterval(updateMintingQueuePosition, 5000);

  //     return () => {
  //       controller.abort();
  //       clearInterval(interval);
  //     };
  //   }, [accessToken, validPayment]);

  return (
    <>
      {/* 
        Component is intended to check a users handle status.

        If the user has a cookie, we can check all of their handle statuses
        - If all of their handles have been minted show a success message 

        If the user does not have a cookie, show an input field where they can add their transaction hash.
    */}
      <h1 className="m-0 text-center inline-block mb-4 text-4xl font-bold leading-none">
        Check you handle(s) status
      </h1>
    </>
  );
};
