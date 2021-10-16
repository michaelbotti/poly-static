import React, { useContext, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { PaymentData, PaymentResponseBody } from "../../../netlify/functions/payment";
import { HandleMintContext } from "../../context/mint";
import { HEADER_APPCHECK, HEADER_JWT_ACCESS_TOKEN, HEADER_JWT_SESSION_TOKEN } from "../../lib/constants";
import { requestToken } from "../../lib/firebase";
import { getRarityCost, getRarityHex } from "../../lib/helpers/nfts";
import { getAccessTokenFromCookie, getSessionTokenFromCookie } from "../../lib/helpers/session";
import { Loader } from "../Loader";
import { LogoMark } from "../logo";

export const HandleSession = ({
  currentIndex
}: { currentIndex: number }) => {
  const { paymentSessions } = useContext(HandleMintContext);
  const [paymentStatus, setPaymentStatus] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const sessionData = paymentSessions[currentIndex];
  const validPayment = paymentStatus.length >= 1 && paymentStatus[0].amount !== 0 && paymentStatus[0].amount === sessionData.sessionResponse.data.cost * 1000000;

  useEffect(() => {
    setLoading(true);
    const checkPayments = async () => {
      if (validPayment) {
        return;
      }

      const appCheck = await requestToken();
      const accessToken = getAccessTokenFromCookie();
      const sessionToken = sessionData.sessionResponse.token;

      if (!accessToken || !sessionToken) {
        return;
      }

      const res: PaymentResponseBody = await fetch(`/.netlify/functions/payment?addresses=${sessionData.sessionResponse.address}`, {
        headers: {
          [HEADER_APPCHECK]: appCheck,
          [HEADER_JWT_ACCESS_TOKEN]: getAccessTokenFromCookie(),
          [HEADER_JWT_SESSION_TOKEN]: sessionToken
        }
      }).then(res => res.json())

      if (!res || res.error) {
        return;
      }

      const payments = res.data.addresses;
      console.log(payments);
      if (payments) {
        setPaymentStatus(payments)
      }
    };

    checkPayments();
    const checkPaymentsInt = setInterval(checkPayments, 10000);

    if (validPayment) {
      clearInterval(checkPaymentsInt);
    }

    return () => clearInterval(checkPaymentsInt);
  }, [currentIndex, validPayment]);

  useEffect(() => {
    if (paymentStatus.length > 0) {
      setLoading(false);
    }
  }, [paymentStatus]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionData.sessionResponse.address);
  }

  return loading ? (
    <div className="col-span-12 lg:col-span-6 relative z-10">
      <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
        <p className="w-full text-center">Fetching details...</p>
        <Loader />
      </div>
    </div>
  ) : (
    <>
      <div className="col-span-6 p-8">
        <h2 className="font-bold text-3xl mb-2">
          Purchasing:<br/>
          <span className="font-normal text-2xl">
            <LogoMark fill={getRarityHex(sessionData.sessionResponse.data.handle)} className="w-4 -mr-1" />{" "}
            {sessionData.sessionResponse.data.handle}
          </span>
        </h2>
        <hr className="w-12 border-dark-300 border-2 block my-8" />
        {!validPayment && paymentStatus[0].amount === 0 && (
          <>
            <h4 className="text-xl font-bold mb-8">
              Send <u>exactly</u> {getRarityCost(sessionData.sessionResponse.data.handle)} $ADA<br/>
              <span className="text-lg font-normal">to the following address:</span>
            </h4>
            <div className="relative">
              <pre className="p-4 rounded-t-lg shadow-inner shadow-lg bg-dark-300 overflow-hidden opacity-70">
                {sessionData.sessionResponse.address}
              </pre>
              <button onClick={handleCopy} className="absolute top-0 right-0 h-full w-16 bg-primary-100 rounded-tr-lg">Copy</button>
            </div>
          </>
        )}
        <Countdown
          onComplete={() => {
            window.location.reload();
          }}
          date={sessionData.sessionResponse.data.exp}
          renderer={({ formatted, total }) => {
            const isWarning = !validPayment && total < 120 * 1000;
            return (
              <div
                className={`${(validPayment) ? 'bg-dark-100 border-primary-200' : 'rounded-t-none bg-dark-100 border-primary-100'} border-t-4 flex items-center justify-between p-8 rounded-b-lg shadow-lg`}
                style={{
                  borderColor: isWarning ? 'red' : ''
                }}
              >
                {validPayment && paymentStatus[0].amount !== 0 && (
                  <>
                    <div>
                      <h2 className="text-xl font-bold mb-2"><strong>Yay!</strong> Your payment was successful!</h2>
                      <p className="text-lg">We're minting your handle right now, but we do it in batches. Please allow 1-2 hours for your handle to arrive in your wallet.</p>
                      <p className="text-lg">This session will automatically close in <strong>{formatted.minutes}:{formatted.seconds}</strong></p>
                    </div>
                  </>
                )}
                {!validPayment && paymentStatus[0].amount !== 0 && (
                  <div className="mt-4">
                    <p className="text-lg">Whoops! That amount wasn't right. We'll refund you as soon as possible.</p>
                    <p className="text-lg">This session will automatically close in <strong>{formatted.minutes}:{formatted.seconds}</strong></p>
                  </div>
                )}
                {!validPayment && paymentStatus[0].amount === 0 && (
                  <>
                    <div>
                      {isWarning && <h6 className="text-lg font-bold" style={{ color: 'red' }}>Hurry Up!</h6>}
                      <h2 className="text-xl font-bold mb-2">Waiting for payment...</h2>
                      <h4 className="text-xl">
                        Time Left: <strong>{formatted.minutes}:{formatted.seconds}</strong>
                      </h4>
                    </div>
                    <Loader className="mx-0" />
                  </>
                )}
              </div>
            )
          }}
        />
      </div>
    </>
  )
}
