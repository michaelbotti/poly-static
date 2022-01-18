import React from "react";
import { SessionResponseBody } from "../../../../netlify/functions/session";

export const ReserveSPOHandle = ({
  sessionData,
}: {
  sessionData: SessionResponseBody;
}): JSX.Element => {
  return (
    <>
      <h2 className="font-bold text-3xl text-primary-100 mb-2">
        Securing Your Handle
      </h2>
    </>
  );
};
