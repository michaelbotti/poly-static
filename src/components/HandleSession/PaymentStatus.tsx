import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { QueuePositionResponseBody } from "../../../netlify/functions/mintingQueuePosition";
import { VerifyResponseBody } from "../../../netlify/functions/verify";
import { fetchAuthenticatedRequest } from "../../../netlify/helpers/fetchAuthenticatedRequest";
import {
  HEADER_IS_SPO,
  HEADER_JWT_ALL_SESSIONS_TOKEN,
} from "../../lib/constants";
import { getAllCurrentSessionCookie } from "../../lib/helpers/session";
import Button from "../button";
import { Loader } from "../Loader";

interface Props {
  handle: string;
  accessToken: VerifyResponseBody;
  validPayment: boolean;
  waitingForPayment: boolean;
  isSPO: boolean;
  clearSession: () => void;
}

export const PaymentStatus: React.FC<Props> = ({
  handle,
  accessToken,
  validPayment,
  waitingForPayment,
  isSPO,
  clearSession,
}) => {
  const [fetchingMintingQueuePosition, setFetchingMintingQueuePosition] =
    useState(false);
  const [error, setError] = useState(false);
  const [mintingQueuePosition, setMintingQueuePosition] = useState<
    number | null
  >(null);
  const [mintingQueueMinutes, setMintingQueueMinutes] = useState<number | null>(
    null
  );

  useEffect(() => {
    const allSessionsCookie = getAllCurrentSessionCookie();
    if (!accessToken || !allSessionsCookie || !validPayment) {
      return;
    }

    const controller = new AbortController();
    const updateMintingQueuePosition = async () => {
      await fetchAuthenticatedRequest<QueuePositionResponseBody>(
        `/.netlify/functions/mintingQueuePosition`,
        {
          signal: controller.signal,
          headers: {
            [HEADER_IS_SPO]: isSPO ? "true" : "false",
            [HEADER_JWT_ALL_SESSIONS_TOKEN]: allSessionsCookie.token,
          },
        },
        isSPO
      )
        .then((res) => {
          if (!res.error) {
            setMintingQueuePosition(res.mintingQueuePosition);
            setMintingQueueMinutes(res.minutes);
            setFetchingMintingQueuePosition(false);
            return;
          }

          setError(true);
          setFetchingMintingQueuePosition(false);
        })
        .catch((e) => {});
    };

    updateMintingQueuePosition();
    const interval = setInterval(updateMintingQueuePosition, 5000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [accessToken, validPayment]);

  return (
    <Countdown
      date={new Date(accessToken.data.exp * 1000)}
      renderer={({ formatted, total }) => {
        const isWarning = !validPayment && total < 120 * 1000;
        return (
          <div
            className={`${
              validPayment
                ? "bg-dark-100 border-primary-200"
                : "rounded-t-none bg-dark-100 border-primary-100"
            } border-t-4 flex items-center justify-between p-8 rounded-b-lg shadow-lg`}
            style={{
              borderColor: isWarning ? "red" : "",
            }}
          >
            {/* Payment was successful! */}
            {validPayment && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    <strong>Yay!</strong> Your payment was successful!
                  </h2>
                  {/* TODO: Add details about current minting position */}
                  <p className="text-lg">
                    We're minting your Handle <strong>right now.</strong> Please
                    allow up to a few hours to receive your NFT.
                  </p>
                  {!error &&
                  !fetchingMintingQueuePosition &&
                  mintingQueueMinutes &&
                  mintingQueuePosition ? (
                    <p className="text-lg">
                      Based on our current minting queue, you are currently at
                      position {mintingQueuePosition}. This will take
                      approximately {mintingQueueMinutes} minutes to process.
                    </p>
                  ) : null}
                  <p className="text-lg">
                    Your unique URL:
                    <br />
                    <a
                      className="text-primary-100"
                      href={
                        "undefined" !== typeof window &&
                        window.location.host !== "adahandle.com"
                          ? `https://testnet.handle.me/${handle}`
                          : `https://handle.me/${handle}`
                      }
                      target="_blank"
                    >
                      {"undefined" !== typeof window &&
                      window.location.host !== "adahandle.com"
                        ? `https://testnet.handle.me/${handle}`
                        : `https://handle.me/${handle}`}
                    </a>
                  </p>
                  <hr className="w-12 border-dark-300 border-2 block my-8" />
                  <Button onClick={clearSession}>Get Another Handle!</Button>
                </div>
              </>
            )}
            {/* No payment found on chain. Still waiting for payment */}
            {waitingForPayment && (
              <>
                <div>
                  {isWarning && (
                    <h6 className="text-lg font-bold" style={{ color: "red" }}>
                      Hurry Up!
                    </h6>
                  )}
                  <h2 className="text-xl font-bold mb-2">
                    Waiting for payment...
                  </h2>
                </div>
                <Loader className="mx-0" />
              </>
            )}
          </div>
        );
      }}
    />
  );
};
