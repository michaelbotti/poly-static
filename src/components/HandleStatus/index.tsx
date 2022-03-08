import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  HEADER_ALL_SESSIONS,
  HEADER_IS_SPO,
  HEADER_JWT_ALL_SESSIONS_TOKEN,
} from "../../lib/constants";
import { getAllCurrentSessionCookie } from "../../lib/helpers/session";
import {
  SessionStatus,
  SessionStatusType,
  TypeAccordion,
} from "./TypeAccordion";

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

    const allSessions = allSessionsCookie?.data?.sessions;

    if (!allSessions.length) {
      // no sessions available
      return;
    }

    setFetchingMintingQueuePosition(true);

    const result = await fetch(`/.netlify/functions/mintingQueuePosition`, {
      headers: {
        [HEADER_IS_SPO]: "false",
        [HEADER_JWT_ALL_SESSIONS_TOKEN]: allSessionsCookie.token,
        [HEADER_ALL_SESSIONS]: JSON.stringify(allSessions),
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

  const renderSessions = () => {
    if (!mintingQueuePositionResponse?.sessions) {
      return null;
    }

    const sessions = mintingQueuePositionResponse.sessions as SessionStatus[];

    if (sessions.length === 0) {
      return <p>No sessions found</p>;
    }

    const items = sessions.reduce<Record<SessionStatusType, SessionStatus[]>>(
      (r, v, _i, _a, k = v.type) => ((r[k] || (r[k] = [])).push(v), r),
      {} as Record<SessionStatusType, SessionStatus[]>
    );

    const confirmedItems = items[SessionStatusType.CONFIRMED];
    const waitingForConfirmationItems =
      items[SessionStatusType.WAITING_FOR_CONFIRMATION];
    const waitingForMiningItems = items[SessionStatusType.WAITING_FOR_MINING];
    const waitingForPaymentItems = items[SessionStatusType.WAITING_FOR_PAYMENT];
    const refundedItems = items[SessionStatusType.REFUNDED];

    return (
      <>
        {confirmedItems?.length > 0 && (
          <TypeAccordion
            items={confirmedItems}
            type={SessionStatusType.CONFIRMED}
          />
        )}
        {waitingForConfirmationItems?.length > 0 && (
          <TypeAccordion
            items={waitingForConfirmationItems}
            type={SessionStatusType.WAITING_FOR_CONFIRMATION}
          />
        )}
        {waitingForMiningItems?.length > 0 && (
          <TypeAccordion
            items={waitingForMiningItems}
            type={SessionStatusType.WAITING_FOR_MINING}
          />
        )}
        {waitingForPaymentItems?.length > 0 && (
          <TypeAccordion
            items={waitingForPaymentItems}
            type={SessionStatusType.WAITING_FOR_PAYMENT}
          />
        )}
        {refundedItems?.length > 0 && (
          <TypeAccordion
            items={refundedItems}
            type={SessionStatusType.REFUNDED}
          />
        )}
      </>
    );
  };

  return (
    <>
      <h1 className="m-0 text-center inline-block mb-4 text-4xl font-bold leading-none">
        Check your Handle status
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
