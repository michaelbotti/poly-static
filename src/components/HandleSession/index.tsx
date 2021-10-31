import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { PaymentData, PaymentResponseBody } from "../../../netlify/functions/payment";
import { HandleMintContext } from "../../context/mint";
import { COOKIE_SESSION_PREFIX, HEADER_JWT_ACCESS_TOKEN, HEADER_JWT_SESSION_TOKEN } from "../../lib/constants";
import { getRarityCost, getRarityHex } from "../../lib/helpers/nfts";
import { getAccessTokenFromCookie, getSessionTokenFromCookie } from "../../lib/helpers/session";
import { Loader } from "../Loader";
import Button from "../button";
import { SessionResponseBody } from "../../../netlify/functions/session";
import { Link } from "gatsby";

export const HandleSession = ({
  sessionData
}:{
  sessionData: SessionResponseBody
}) => {
  const { currentIndex, setCurrentIndex } = useContext(HandleMintContext);
  const [paymentStatus, setPaymentStatus] = useState<PaymentData>(null);
  const [fetchingPayment, setFetchingPayment] = useState<boolean>(true);
  const [copying, setCopying] = useState<boolean>(false);
  const [retry, setRetry] = useState<boolean>(true);

  // Reset on index change.
  useEffect(() => {
    setFetchingPayment(true);
    setPaymentStatus(null);
    setRetry(true);

    const activeSession = getSessionTokenFromCookie(currentIndex);
    if (!activeSession) {
      setCurrentIndex(0);
    }
  }, [currentIndex]);

  const handleCopy = async () => {
    navigator.clipboard.writeText(sessionData.address);
    setCopying(true);
    setTimeout(() => {
      setCopying(false);
    }, 1000);
  }

  // Check current session payment status.
  useEffect(() => {
    const controller = new AbortController();
    const updatePaymentStatus = async () => {
      await fetch(
        `/.netlify/functions/payment?addresses=${sessionData.address}`,
        {
          signal: controller.signal,
          headers: {
            [HEADER_JWT_ACCESS_TOKEN]: getAccessTokenFromCookie(),
            [HEADER_JWT_SESSION_TOKEN]: sessionData.token
          }
        }
      )
      .then(res => res.json())
      .then((res: PaymentResponseBody) => {
        if (res.data.addresses) {
          setPaymentStatus(res.data.addresses[0]);
          setFetchingPayment(false)
        }
      })
      .catch(e => {})
    };

    updatePaymentStatus();
    const interval = setInterval(updatePaymentStatus, 5000);

    if (!retry) {
      clearInterval(interval);
    }

    return () => {
      controller.abort();
      clearInterval(interval)
    };
  }, [retry, sessionData, currentIndex]);

  const validPayment = paymentStatus && paymentStatus.amount !== 0 && paymentStatus.amount === sessionData.data.cost * 1000000;
  const invalidPayment = paymentStatus && paymentStatus.amount !== 0 && paymentStatus.amount !== sessionData.data.cost * 1000000;

  if (!sessionData) {
    return (
      <div className="col-span-12 md:col-span-6 relative z-10">
        <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
          <p className="w-full text-center">Fetching details...</p>
          <Loader />
        </div>
      </div>
    )
  }

  if (invalidPayment && !fetchingPayment) {
    return (
      <div className="col-span-6">
        <h2 className="font-bold text-3xl mb-2">
          Invalid Payment!
        </h2>
        <p className="text-lg">Sorry, but you sent an incorrect amount for your Handle. Any invalid payments will be refunded within 14 days. <Link className="text-primary-100" to="/faq">See our FAQ.</Link></p>
        <hr className="w-12 border-dark-300 border-2 block my-8" />
        <Button onClick={() => {
          Cookies.remove(`${COOKIE_SESSION_PREFIX}_${currentIndex}`)
          setCurrentIndex(0);
        }}>
          Clear Session &amp; Try Again!
        </Button>
      </div>
    )
  }

  return (
    <div className="col-span-6">
      <h2 className="font-bold text-3xl mb-2">
        Session Active
      </h2>
      <p className="text-lg">Submit your payment <u>exactly</u> in the amount shown. Invalid payments will be refunded, but your session will remain till it expires!</p>
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
              Send <u>exaclty the amount shown</u>:<br/>
              <strong className="text-4xl mt-4 inline-block font-bold" style={{ color: getRarityHex(sessionData.data.handle)}}>{getRarityCost(sessionData.data.handle)} $ADA</strong>
            </h4>
            <div className="relative">
              <pre className="p-4 rounded-t-lg shadow-inner shadow-lg bg-dark-300 overflow-hidden overflow-scroll pr-24 border-2 border-b-0 border-primary-100">
                {sessionData.address}
              </pre>
              <button onClick={handleCopy} className="absolute top-0 right-0 h-full w-16 bg-primary-100 rounded-tr-lg">
                <svg className={`w-full height-full p-5 ${copying ? 'hidden' : 'block'}`} viewBox="0 0 20 20">
                  <path
                    fill="#fff"
                    d="M18.783 13.198H15.73a.78.78 0 010-1.559h2.273V3.652H7.852v.922c0 .433-.349.78-.78.78a.778.778 0 01-.78-.78V2.872c0-.43.349-.78.78-.78h11.711c.431 0 .78.35.78.78v9.546a.781.781 0 01-.78.78z"
                  />
                  <path
                    fill="#fff"
                    d="M12.927 17.908H1.217a.781.781 0 01-.78-.78V7.581c0-.43.349-.78.78-.78h11.709c.431 0 .78.35.78.78v9.546c0 .43-.349.781-.779.781zm-10.93-1.56h10.15V8.361H1.997v7.987z"
                  />
                </svg>

                <svg className={`w-full height-full p-5 ${copying ? 'block' : 'hidden'}`} viewBox="0 0 20 20">
                  <path
                    fill="#fff"
                    d="M7.197 16.963h-.002a.773.773 0 01-.544-.227L.612 10.654a.769.769 0 011.09-1.084l5.495 5.536L18.221 4.083a.767.767 0 011.087 0c.301.3.301.787 0 1.087L7.741 16.738a.772.772 0 01-.544.225z"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
        {paymentStatus && (
          <Countdown
            onComplete={() => setCurrentIndex(0)}
            date={sessionData.data.exp}
            renderer={({ formatted, total }) => {
              const isWarning = !validPayment && total < 120 * 1000;
              return (
                <div
                  className={`${(validPayment) ? 'bg-dark-100 border-primary-200' : 'rounded-t-none bg-dark-100 border-primary-100'} border-t-4 flex items-center justify-between p-8 rounded-b-lg shadow-lg`}
                  style={{
                    borderColor: isWarning ? 'red' : ''
                  }}
                >
                  {validPayment && (
                    <>
                      <div>
                        <h2 className="text-2xl font-bold mb-2"><strong>Yay!</strong> Your payment was successful!</h2>
                        <p className="text-lg">We're minting your handle <strong>right now.</strong> Please allow up to a few hours to receive your NFT.</p>
                        <p className="text-lg">Your unique URL: <a className="text-primary-100" href={`https://handle.me/${sessionData.data.handle}`} target="_blank">https://handle.me/{sessionData.data.handle}</a></p>
                        <p className="text-lg">This session will close in: <strong>{formatted.minutes}:{formatted.seconds}</strong></p>
                      </div>
                    </>
                  )}
                  {!validPayment && !invalidPayment && (
                    <>
                      <div>
                        {isWarning && <h6 className="text-lg font-bold" style={{ color: 'red' }}>Hurry Up!</h6>}
                        {paymentStatus && paymentStatus.amount === 0 && !fetchingPayment && (
                          <h2 className="text-xl font-bold mb-2">Waiting for payment...</h2>
                        )}
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
        )}
        </>
      )}
    </div>
  )
}
