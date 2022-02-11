import Countdown from "react-countdown";
import { VerifyResponseBody } from "../../../netlify/functions/verify";
import Button from "../button";
import { Loader } from "../Loader";

interface Props {
  handle: string;
  accessToken: VerifyResponseBody;
  validPayment: boolean;
  waitingForPayment: boolean;
  clearSession: () => void;
}

export const PaymentStatus: React.FC<Props> = ({
  handle,
  accessToken,
  validPayment,
  waitingForPayment,
  clearSession,
}) => {
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
                    We're minting your handle <strong>right now.</strong> Please
                    allow up to a few hours to receive your NFT.
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

                  <p className="text-lg">Ready to get another handle?</p>
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
