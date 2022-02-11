import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import Countdown from "react-countdown";
import {
  PaymentData,
  PaymentResponseBody,
} from "../../../netlify/functions/payment";
import { HandleMintContext } from "../../context/mint";
import {
  COOKIE_ACCESS_KEY,
  COOKIE_SESSION_PREFIX,
  HEADER_HANDLE,
  HEADER_JWT_ACCESS_TOKEN,
  HEADER_JWT_SESSION_TOKEN,
  SPO_ADA_HANDLE_COST,
} from "../../lib/constants";
import { getRarityCost, getRarityHex } from "../../lib/helpers/nfts";
import {
  getAccessTokenFromCookie,
  getSessionTokenFromCookie,
} from "../../lib/helpers/session";
import { Loader } from "../Loader";
import Button from "../button";
import { SessionResponseBody } from "../../../netlify/functions/session";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import { VerifyResponseBody } from "../../../netlify/functions/verify";
import { fetchAuthenticatedRequest } from "../../../netlify/helpers/fetchAuthenticatedRequest";

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

  const { currentIndex, setCurrentIndex, setCurrentAccess } =
    useContext(HandleMintContext);

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

    const session = getSessionTokenFromCookie(currentIndex);
    setActiveSession(session);
    if (!session) {
      setCurrentIndex(0);
    }

    setAccessToken(getAccessTokenFromCookie());
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
            [HEADER_JWT_SESSION_TOKEN]: token,
          },
        }
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
    Cookies.remove(`${COOKIE_SESSION_PREFIX}_${currentIndex}`);

    if (isSPO) {
      setCurrentAccess(false);
      Cookies.remove(COOKIE_ACCESS_KEY);
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
          payments will be refunded within 14 days.{" "}
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
          from the SPO owners' wallet. Payments will be refunded within 14 days
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
      <h2 className="font-bold text-3xl mb-2">Session Active</h2>
      <p className="text-lg">
        Submit your payment <u>exactly</u> in the amount shown.{" "}
        {isSPO ? (
          <span>
            Invalid payments will be refunded, minus a 50 ADA processing, but
            can take up to 14 days!
          </span>
        ) : (
          <span>
            Invalid payments will be refunded, but can take up to 14 days!
          </span>
        )}
      </p>
      <ul>
        {isSPO ? (
          <li>
            Do NOT send from an exchange. Only use a STAKE POOL wallet you own
            the keys to (like Nami, Yoroi, Daedalus, etc).
          </li>
        ) : (
          <li>
            Do NOT send from an exchange. Only use wallets you own the keys to
            (like Nami, Yoroi, Daedalus, etc).
          </li>
        )}
        <li>Do NOT send more than one payment.</li>
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
                <pre className="p-4 rounded-t-lg shadow-inner shadow-lg bg-dark-300 overflow-hidden overflow-scroll pr-24 border-2 border-b-0 border-primary-100">
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
                            We're minting your handle{" "}
                            <strong>right now.</strong> Please allow up to a few
                            hours to receive your NFT.
                          </p>
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
                          <p className="text-lg">
                            Ready to get another handle?
                          </p>
                          <hr className="w-12 border-dark-300 border-2 block my-8" />
                          <Button onClick={clearSession}>
                            Click Here &amp; Try Again!
                          </Button>
                        </div>
                      </>
                    )}
                    {/* No payment found on chain. Still waiting for payment */}
                    {waitingForPayment && (
                      <>
                        <div>
                          {isWarning && (
                            <h6
                              className="text-lg font-bold"
                              style={{ color: "red" }}
                            >
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
          )}
        </>
      )}
    </div>
  );
};
