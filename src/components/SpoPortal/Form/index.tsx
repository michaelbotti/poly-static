import React, { FC, useRef, useState } from "react";
import { SpoVerifyResponseBody } from "../../../../netlify/functions/spoVerify";

import {
  HEADER_RECAPTCHA,
  HEADER_RECAPTCHA_FALLBACK,
  RECAPTCHA_SITE_KEY_FALLBACK,
} from "../../../lib/constants";
import {
  getRecaptchaToken,
  setAccessTokenCookie,
} from "../../../lib/helpers/session";
import Button from "../../button";

interface Props {
  setReCaptchaToken: React.Dispatch<React.SetStateAction<string>>;
}

export const SpoEnterForm: FC<Props> = ({ setReCaptchaToken }): JSX.Element => {
  const [verifyingRecaptcha, setVerifyingRecaptcha] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>(null);

  const fallbackRecaptcha = useRef(null);

  const form = useRef(null);

  const setTimeoutResponseMessage = (message: string) => {
    setResponseMessage(message);
    setTimeout(() => {
      setResponseMessage("");
    }, 4000);
  };

  const performVerification = async (token) => {
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
        setAccessTokenCookie(res, data.exp);
      }

      if (!verified && error && message) {
        setResponseMessage(message);
      }
    } catch (e) {
      setTimeoutResponseMessage("Hmm, try that again. Something went wrong.");
      console.log(e);
    }
  };

  // perform recatcha before allowing SPOs to enter
  const performReCaptcha = () => {
    setVerifyingRecaptcha(true);
    (window as any).grecaptcha.render(fallbackRecaptcha.current, {
      sitekey: RECAPTCHA_SITE_KEY_FALLBACK,
      theme: "dark",
      callback: async (token: string) => {
        console.log(token);
        await performVerification(token);
        setReCaptchaToken(token);
      },
    });
  };

  const handleSubmit = async (e: Event | null) => {
    e && e.preventDefault();
    performReCaptcha();
  };

  return (
    <div className="col-span-12 md:col-span-6 md:col-start-4 relative z-10">
      <h2 className="text-primary-100 font-bold text-5xl text-center mb-8">
        SPO Portal
      </h2>
      <form onSubmit={(e) => e.preventDefault()} ref={form}>
        <Button
          className={`w-full`}
          buttonStyle={"primary"}
          type="submit"
          disabled={verifyingRecaptcha}
          onClick={handleSubmit}
        >
          {verifyingRecaptcha && "Waiting..."}
          {!verifyingRecaptcha && "Enter"}
        </Button>
      </form>
      {responseMessage && <p className="my-2 text-center">{responseMessage}</p>}
      <div
        className="flex items-center justify-center my-4"
        ref={fallbackRecaptcha}
      />
    </div>
  );
};
