import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { HandleMintContext } from "../../context/mint";
import {
  COOKIE_ACCESS_KEY,
  COOKIE_SESSION_PREFIX,
  HEADER_IS_SPO,
  REFUND_POLICY_DATE,
  SPO_ADA_HANDLE_COST,
  SPO_COOKIE_ACCESS_KEY,
  SPO_COOKIE_SESSION_PREFIX,
} from "../../lib/constants";
import { getRarityCost, getRarityHex } from "../../lib/helpers/nfts";
import {
  getAccessTokenFromCookie,
  getSessionTokenFromCookie,
  getSPOAccessTokenCookie,
  getSPOSessionTokenFromCookie,
} from "../../lib/helpers/session";
import { Loader } from "../Loader";
import Button from "../button";
import { SessionResponseBody } from "../../../netlify/functions/session";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import { VerifyResponseBody } from "../../../netlify/functions/verify";
import { fetchAuthenticatedRequest } from "../../../netlify/helpers/fetchAuthenticatedRequest";
import { PaymentStatus } from "./PaymentStatus";
import { getSessionTokenCookieName } from "../../../netlify/helpers/util";

enum ConfirmPaymentStatusCode {
  CONFIRMED = "CONFIRMED",
  INVALID_PAYMENT = "INVALID_PAYMENT",
  INVALID_PAYMENT_SPO = "INVALID_PAYMENT_SPO",
  SERVER_ERROR = "SERVER_ERROR",
  MISSING_PARAM = "MISSING_PARAM",
  PENDING = "PENDING",
  BAD_STATE = "BAD_STATE",
}

interface PaymentConfirmedItem {
  statusCode: ConfirmPaymentStatusCode;
  address: string;
}

interface PaymentConfirmedResponse {
  error: boolean;
  data: {
    statusCode?: ConfirmPaymentStatusCode;
    items?: PaymentConfirmedItem[];
  };
}

export const HandleSession = ({
  sessionData,
}: {
  sessionData: SessionResponseBody;
}) => {
  const {
    data: { isSPO, handle, cost, exp },
    address,
    token,
  } = sessionData;

  const {
    currentIndex,
    setCurrentIndex,
    setCurrentAccess,
    setCurrentSPOAccess,
    stateData,
  } = useContext(HandleMintContext);

  const [paymentStatus, setPaymentStatus] =
    useState<ConfirmPaymentStatusCode | null>(null);
  const [fetchingPayment, setFetchingPayment] = useState<boolean>(true);
  const [copying, setCopying] = useState<boolean>(false);
  const [retry, setRetry] = useState<boolean>(true);
  const [isTestnet, setIsTestnet] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<false | VerifyResponseBody>(
    false
  );
  const [activeSession, setActiveSession] = useState<
    false | SessionResponseBody
  >(false);
  const [error, setError] = useState<boolean>(false);

  const { hostname } = useLocation();

  useEffect(() => {
    if (hostname.includes("testnet") || hostname.includes("localhost")) {
      setIsTestnet(true);
    }
  }, [hostname]);

  // Reset on index change.
  useEffect(() => {
    setFetchingPayment(true);
    setPaymentStatus(null);
    setRetry(true);

    const session = isSPO
      ? getSPOSessionTokenFromCookie(currentIndex)
      : getSessionTokenFromCookie(currentIndex);
    setActiveSession(session);
    if (!session) {
      setCurrentIndex(0);
    }

    const accessToken = isSPO
      ? getSPOAccessTokenCookie()
      : getAccessTokenFromCookie();
    setAccessToken(accessToken);
  }, [currentIndex]);

  const handleCopy = async () => {
    navigator.clipboard.writeText(address);
    setCopying(true);
    setTimeout(() => {
      setCopying(false);
    }, 1000);
  };

  // Check current session payment status.
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const controller = new AbortController();
    const updatePaymentStatus = async () => {
      await fetchAuthenticatedRequest<PaymentConfirmedResponse>(
        `/.netlify/functions/payment?addresses=${address}`,
        {
          signal: controller.signal,
          headers: {
            [getSessionTokenCookieName(isSPO)]: token,
            [HEADER_IS_SPO]: isSPO ? "true" : "false",
          },
        },
        isSPO
      )
        .then((res) => {
          if (!res.error) {
            if (!res.data.items) {
              setPaymentStatus(res.data.statusCode);
              setFetchingPayment(false);
              return;
            }

            setPaymentStatus(res.data.items[0].statusCode);
            setFetchingPayment(false);
            return;
          }

          setError(true);
          setPaymentStatus(res.data.statusCode);
          setFetchingPayment(false);
        })
        .catch((e) => {});
    };

    updatePaymentStatus();
    const interval = setInterval(updatePaymentStatus, 5000);

    if (!retry) {
      clearInterval(interval);
    }

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [retry, sessionData, currentIndex, accessToken]);

  const clearSession = () => {
    setCurrentIndex(0);

    if (isSPO) {
      // Only clear the session if it's the SPO session.
      setCurrentSPOAccess(false);
      Cookies.remove(SPO_COOKIE_ACCESS_KEY);
      Cookies.remove(`${SPO_COOKIE_SESSION_PREFIX}_${currentIndex}`);
    } else {
      Cookies.remove(`${COOKIE_SESSION_PREFIX}_${currentIndex}`);
    }
  };

  const waitingForPayment = paymentStatus === ConfirmPaymentStatusCode.PENDING;
  const validPayment = paymentStatus === ConfirmPaymentStatusCode.CONFIRMED;
  const invalidPayment =
    paymentStatus === ConfirmPaymentStatusCode.INVALID_PAYMENT;
  const invalidSpoPayment =
    paymentStatus === ConfirmPaymentStatusCode.INVALID_PAYMENT_SPO;

  if (!sessionData) {
    return (
      <div className="col-span-12 md:col-span-6 relative z-10">
        <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
          <p className="w-full text-center">Fetching details...</p>
          <Loader />
        </div>
      </div>
    );
  }

  if (invalidPayment && !fetchingPayment) {
    return (
      <div className="col-span-6">
        <h2 className="font-bold text-3xl mb-2">Invalid Payment!</h2>
        <p className="text-lg">
          Sorry, but you sent an incorrect amount for your Handle. Any invalid
          payments will be refunded within {REFUND_POLICY_DATE}.{" "}
          <Link className="text-primary-100" to="/faq">
            See our FAQ.
          </Link>
        </p>
        <hr className="w-12 border-dark-300 border-2 block my-8" />
        <Button onClick={clearSession}>Click Here &amp; Try Again!</Button>
      </div>
    );
  }

  if (invalidSpoPayment && !fetchingPayment) {
    return (
      <div className="col-span-6">
        <h2 className="font-bold text-3xl mb-2">Invalid Payment!</h2>
        <p className="text-lg">
          Sorry, but the Cardano blockchain shows that this payment did not come
          from the SPO owners' wallet. Payments will be refunded within{" "}
          {REFUND_POLICY_DATE}
          with a processing fee deducted{" "}
          <Link className="text-primary-100" to="/faq">
            See our FAQ.
          </Link>
        </p>
        <hr className="w-12 border-dark-300 border-2 block my-8" />
        <Button onClick={clearSession}>Click Here &amp; Try Again!</Button>
      </div>
    );
  }

  return (
    <div className="col-span-6">
      <h2 className="font-bold text-3xl mb-2">Handle payment</h2>
      <p className="text-lg">
        Submit your payment <u>exactly</u> in the amount shown. Invalid payments
        will be refunded, but can take up to {REFUND_POLICY_DATE}!
      </p>
      <ul>
        {isSPO ? (
          <>
            <li>
              <b>
                <u>
                  Invalid payments will be refunded, minus a 50 ADA processing
                  fee
                </u>
              </b>
            </li>
            <li>
              Do NOT send from an exchange. Only use a STAKE POOL wallet you own
              the keys to (like Nami, Yoroi, Daedalus, etc).
            </li>
          </>
        ) : (
          <li>
            Do NOT send from an exchange. Only use wallets you own the keys to
            (like Nami, Yoroi, Daedalus, etc).
          </li>
        )}
        <li>Byron wallets and bundled transactions will be refunded.</li>
        <li>Do NOT send more than one payment.</li>
        <li>
          Each Handle payment has{" "}
          {isSPO
            ? "1 hour"
            : `${stateData?.paymentWindowTimeoutMinutes ?? 60} minutes`}{" "}
          to settle on the blockchain before it will be considered expired. If
          your access window expires before a your Handle payment window, the{" "}
          {isSPO
            ? "1 hour"
            : `${stateData?.paymentWindowTimeoutMinutes ?? 60} minutes`}{" "}
          minute window will still be honored!
        </li>
      </ul>
      <br />
      <hr className="w-12 border-dark-300 border-2 block my-8" />

      {fetchingPayment ? (
        <div className="flex flex-col items-center justify-center">
          <Loader />
          <h2 className="text-xl font-bold my-2">Checking details...</h2>
        </div>
      ) : (
        <>
          {!validPayment && (
            <>
              <h4 className="text-xl mb-8">
                <strong
                  className="text-4xl mt-4 inline-block font-bold"
                  style={{ color: getRarityHex(handle) }}
                >
                  {isSPO ? SPO_ADA_HANDLE_COST : getRarityCost(handle)}{" "}
                  {isTestnet ? "tADA" : "ADA"}
                </strong>
              </h4>
              <div className="relative">
                <pre className="p-4 rounded-none rounded-tr-lg rounded-tl-lg shadow-inner shadow-lg bg-dark-300 overflow-hidden overflow-scroll pr-24 border-2 border-b-0 border-primary-100">
                  {address}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-0 right-0 h-full w-16 bg-primary-100 rounded-tr-lg"
                >
                  <svg
                    className={`w-full height-full p-5 ${
                      copying ? "hidden" : "block"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#fff"
                      d="M18.783 13.198H15.73a.78.78 0 010-1.559h2.273V3.652H7.852v.922c0 .433-.349.78-.78.78a.778.778 0 01-.78-.78V2.872c0-.43.349-.78.78-.78h11.711c.431 0 .78.35.78.78v9.546a.781.781 0 01-.78.78z"
                    />
                    <path
                      fill="#fff"
                      d="M12.927 17.908H1.217a.781.781 0 01-.78-.78V7.581c0-.43.349-.78.78-.78h11.709c.431 0 .78.35.78.78v9.546c0 .43-.349.781-.779.781zm-10.93-1.56h10.15V8.361H1.997v7.987z"
                    />
                  </svg>

                  <svg
                    className={`w-full height-full p-5 ${
                      copying ? "block" : "hidden"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#fff"
                      d="M7.197 16.963h-.002a.773.773 0 01-.544-.227L.612 10.654a.769.769 0 011.09-1.084l5.495 5.536L18.221 4.083a.767.767 0 011.087 0c.301.3.301.787 0 1.087L7.741 16.738a.772.772 0 01-.544.225z"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
          {paymentStatus && accessToken && (
            <PaymentStatus
              handle={handle}
              accessToken={accessToken}
              validPayment={validPayment}
              waitingForPayment={waitingForPayment}
              isSPO={isSPO}
              clearSession={clearSession}
            />
          )}
        </>
      )}
    </div>
  );
};
