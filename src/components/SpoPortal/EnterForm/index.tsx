import { Link } from "gatsby";
import React, { useContext, useRef, useState } from "react";
import { SpoVerifyResponseBody } from "../../../../netlify/functions/spoVerify";
import { HandleMintContext } from "../../../context/mint";

import {
  HEADER_RECAPTCHA,
  HEADER_RECAPTCHA_FALLBACK,
  RECAPTCHA_SITE_KEY_FALLBACK,
} from "../../../lib/constants";
import {
  getRecaptchaToken,
  setSPOAccessTokenCookie,
} from "../../../lib/helpers/session";
import Button from "../../button";

export const EnterForm = (): JSX.Element => {
  const { setCurrentSPOAccess } = useContext(HandleMintContext);
  const [verifyingRecaptcha, setVerifyingRecaptcha] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>(null);
  const [touChecked, setTouChecked] = useState<boolean>(false);

  const fallbackRecaptcha = useRef(null);

  const form = useRef(null);

  const setTimeoutResponseMessage = (message: string) => {
    setResponseMessage(message);
    setTimeout(() => {
      setResponseMessage("");
    }, 4000);
  };

  const performVerification = async (token: string): Promise<void> => {
    const recaptchaToken: string = await getRecaptchaToken();

    const headers = new Headers();
    headers.append(HEADER_RECAPTCHA, recaptchaToken);
    headers.append(HEADER_RECAPTCHA_FALLBACK, token);

    try {
      const res: SpoVerifyResponseBody = await fetch(
        "/.netlify/functions/spoVerify",
        {
          headers,
        }
      )
        .then((res) => res.json())
        .catch((e) => console.log(e));

      const { error, verified, message, token, data } = res;
      if (!error && verified && token && data) {
        setSPOAccessTokenCookie(res, data.exp);
        setCurrentSPOAccess(res);
      }

      if (!verified && error && message) {
        setResponseMessage(message);
      }
    } catch (e) {
      setTimeoutResponseMessage("Hmm, try that again. Something went wrong.");
    }
  };

  // perform recatcha before allowing SPOs to enter
  const performReCaptcha = (): void => {
    setVerifyingRecaptcha(true);
    (window as any).grecaptcha.render(fallbackRecaptcha.current, {
      sitekey: RECAPTCHA_SITE_KEY_FALLBACK,
      theme: "dark",
      callback: async (token: string) => {
        await performVerification(token);
      },
    });
  };

  const handleSubmit = async (e: Event | null): Promise<void> => {
    e && e.preventDefault();
    performReCaptcha();
  };

  return (
    <>
      <div className="col-span-12">
        <h2 className="text-primary-100 font-bold text-5xl text-center mb-2">
          SPO Portal
        </h2>
      </div>
      <div className="col-span-12">
        <div className="shadow-lg rounded-lg border-2 border-primary-100 p-4 md:p-8 mb-8">
          <h3 className="text-white text-3xl font-bold text-center mb-4">
            How it Works
          </h3>
          <p className="text-lg text-center text-dark-350">
            Purchasing a Handle during for SPOs is a 3-step process, starting
            with:
          </p>
          <ol className="mb-4">
            <li>Search and select an available Handle to purchase.</li>
            <li>
              Once you have started your session, you <b>must</b> use your STAKE
              POOL operators wallet for the purchase
            </li>
            <li>
              If you make a payment using a wallet other than the wallet
              attached to your stake pool, your payment will be refunded minus a
              50 ADA processing fee
            </li>
          </ol>
          <p>
            Pricing for each Handle is 250 ADA. You can see full details on{" "}
            <Link to="/faq" className="text-primary-100">
              our FAQ page
            </Link>
            !
          </p>
          <p>
            For security reasons, we have taken a snapshot of all existing pools
            on 1/20/2022 and for this initial phase will only allow minting of
            those tickers. All pools created after this date will need to await
            public sale.
          </p>
          <p>
            All pools that reserved their tickers via the Google Form in
            September 2021 will get their corresponding Handles via paying only
            the minting and transaction costs. You will receive a 2 ADA payment
            request (instead of 250 ADA).
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} ref={form}>
          <div className="flex items-center text-sm bg-dark-100 border-dark-300 border-2 rounded-t-lg p-4 pt-2 pb-0">
            <input
              className="form-checkbox p-2 text-primary-200 rounded focus:ring-primary-200 cursor-pointer"
              id="tou"
              name="tou"
              type="checkbox"
              checked={touChecked}
              onChange={() => setTouChecked(!touChecked)}
            />
            <label
              className="ml-2 text-white py-3 cursor-pointer"
              htmlFor="tou"
            >
              I have read and agree to the ADA Handle{" "}
              <Link to="/tou" className="text-primary-100">
                Terms of Use
              </Link>
            </label>
          </div>
          <Button
            className={`w-full rounded-t-none`}
            buttonStyle={"primary"}
            type="submit"
            disabled={verifyingRecaptcha || !touChecked}
            onClick={handleSubmit}
          >
            {verifyingRecaptcha && "Waiting..."}
            {!verifyingRecaptcha && "Enter"}
          </Button>
        </form>
        {responseMessage && (
          <p className="my-2 text-center">{responseMessage}</p>
        )}
        <div
          className="flex items-center justify-center my-4"
          ref={fallbackRecaptcha}
        />
      </div>
    </>
  );
};
