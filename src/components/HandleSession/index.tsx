import React, { useContext, useEffect, useRef, useState } from "react";
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
  const [copying, setCopying] = useState<boolean>(false);

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

  const handleCopy = async () => {
    navigator.clipboard.writeText(sessionData.sessionResponse.address);
    setCopying(true);
    setTimeout(() => {
      setCopying(false);
    }, 1000);
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
          Session Active
        </h2>
        <p className="text-lg">Submit your payment <u>exactly</u> in the amount shown. Invalid payments will be refunded, but your session will remain till it expires!</p>
        <hr className="w-12 border-dark-300 border-2 block my-8" />
        {!validPayment && paymentStatus[0].amount === 0 && (
          <>
            <h4 className="text-xl mb-8">
              Send exaclty <strong className="border-2 border-primary-100 px-2 inline-block text-base rounded-lg">{getRarityCost(sessionData.sessionResponse.data.handle)} $ADA</strong> to the following address:
            </h4>
            <div className="relative">
              <pre className="p-4 rounded-t-lg shadow-inner shadow-lg bg-dark-300 overflow-hidden overflow-scroll pr-24 border-2 border-b-0 border-primary-100">
                {sessionData.sessionResponse.address}
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
