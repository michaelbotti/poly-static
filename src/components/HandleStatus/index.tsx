import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
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
  const [fetchingMintingQueuePosition, setFetchingMintingQueuePosition] =
    useState(false);
  const [error, setError] = useState<boolean>(false);

  const fetchMintingQueuePosition = async () => {
    const allSessionsCookie = getAllCurrentSessionCookie();
    if (!allSessionsCookie) {
      return;
    }

    setFetchingMintingQueuePosition(true);

    const result = await fetch(`/.netlify/functions/mintingQueuePosition`, {
      headers: {
        [HEADER_IS_SPO]: "false",
        [HEADER_JWT_ALL_SESSIONS_TOKEN]: allSessionsCookie.token,
      },
    });
    const response = await result.json();
    if (!response.error) {
      setMintingQueuePositionResponse(response);
      setFetchingMintingQueuePosition(false);
      return;
    }

    setError(true);
    setFetchingMintingQueuePosition(false);
  };

  useEffect(() => {
    fetchMintingQueuePosition();
  }, []);

  console.log("mintingQueuePositionResponse", mintingQueuePositionResponse);

  const renderSessions = () => {
    if (!mintingQueuePositionResponse) {
      return null;
    }

    if (
      mintingQueuePositionResponse.sessions.waitingForPayment.length === 0 &&
      mintingQueuePositionResponse.sessions.waitingForMinting.length === 0 &&
      mintingQueuePositionResponse.sessions.waitingForConfirmation.length ===
        0 &&
      mintingQueuePositionResponse.sessions.confirmed.length === 0
    ) {
      return <p>No sessions found</p>;
    }

    return (
      <div>
        <div>Pending Payment</div>
        <div>
          {mintingQueuePositionResponse.sessions.waitingForPayment.map(
            (session) => {
              return <div>{session.sessionId}</div>;
            }
          )}
        </div>
      </div>
    );
  };

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
      {fetchingMintingQueuePosition ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        renderSessions()
      )}
    </>
  );
};
