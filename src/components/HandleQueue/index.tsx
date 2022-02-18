import React, { useRef, useState, useContext, useEffect } from "react";
import { Link, navigate } from "gatsby";
import { useLocation } from "@reach/router";
import { parse } from "query-string";

import { VerifyResponseBody } from "../../../netlify/functions/verify";
import {
  HEADER_EMAIL,
  HEADER_EMAIL_AUTH,
  HEADER_RECAPTCHA,
  HEADER_RECAPTCHA_FALLBACK,
  RECAPTCHA_SITE_KEY_FALLBACK,
  REFUND_POLICY_DATE,
} from "../../lib/constants";
import Button from "../button";
import {
  getRecaptchaToken,
  setAccessTokenCookie,
} from "../../lib/helpers/session";
import { HandleMintContext } from "../../context/mint";
import { buildClientAgentInfo } from "../../lib/helpers/clientInfo";
import { EmailInputs } from "./EmailInputs";
import { AgreeInputs } from "./AgreeInputs";

const validateEmail = (email: string): boolean => {
  const res =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
};

const getActiveEmail = (): string | null => {
  let value = null;
  if (typeof window !== undefined) {
    const { search } = useLocation();
    const { activeEmail } = parse(search) as { activeEmail: string };
    if (activeEmail && validateEmail(activeEmail)) {
      value = activeEmail;
    }
  }

  return value;
};

const getActiveAuthCode = (): string | null => {
  let value = null;
  if (typeof window !== undefined) {
    const { search } = useLocation();
    const { activeAuthCode } = parse(search) as { activeAuthCode: string };
    value = activeAuthCode || null;
  }

  return value;
};

export const HandleQueue = (): JSX.Element => {
  const { stateData } = useContext(HandleMintContext);
  const [savingSpot, setSavingSpot] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [verifyingRecaptcha, setVerifyingRecaptcha] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>(null);
  const [emailInput, setEmailInput] = useState<string>("");
  const [authInput, setAuthInput] = useState<string>("");
  const [expired, setExpired] = useState<boolean>(false);
  const [emailChecked, setEmailChecked] = useState<boolean>(false);
  const [touChecked, setTouChecked] = useState<boolean>(false);
  const [refundsChecked, setRefundsChecked] = useState<boolean>(false);
  const [recaptchaFallbackToken, setRecaptchaFallbackToken] =
    useState<string>(null);
  const [recaptchaRendered, setRecaptchaRendered] = useState<boolean>(false);

  const fallbackRecaptcha = useRef(null);

  const activeEmail = getActiveEmail();
  const activeAuthCode = getActiveAuthCode();
  const form = useRef(null);

  useEffect(() => {
    if (activeAuthCode) {
      setAuthInput(activeAuthCode);
    }
  }, []);

  const setTimeoutResponseMessage = (message: string) => {
    setResponseMessage(message);
    setTimeout(() => {
      setResponseMessage("");
    }, 4000);
  };

  const handleOnChange = (value: string) => {
    if (value.includes("+")) {
      setTimeoutResponseMessage(
        "Sorry, we do not support email addresses with the (+) character. Try again!"
      );
      return;
    }

    setEmailInput(value);
  };

  const handleSavingResponse = (res) => {
    // Clear the input field for email.
    if (res?.updated) {
      setEmailInput("");

      // Update response state.
      const message =
        res?.accessQueuePosition && res.accessQueuePosition.minutes > 3
          ? `Your approximate position in the access queue is ${res?.accessQueuePosition?.position} out of ${res?.accessQueueSize}. At our current queue processing rate, it should be about ${res?.accessQueuePosition?.minutes} minutes until you receive an email with an access code.`
          : "You should receive an email in a few minutes with your access code.";
      setResponseMessage(
        `You have successfully been entered into the queue! ${message}`
      );
      setSubmitted(true);
    } else if (res?.bot && !recaptchaFallbackToken) {
      setResponseMessage(
        "One more thing, we just need to confirm you are real:"
      );
      setVerifyingRecaptcha(true);
      if (recaptchaRendered) {
        (window as any).grecaptcha.reset(fallbackRecaptcha.current);
      } else {
        (window as any).grecaptcha.render(fallbackRecaptcha.current, {
          sitekey: RECAPTCHA_SITE_KEY_FALLBACK,
          theme: "dark",
          callback: async (token: string) => {
            setSavingSpot(true);
            const res = await handleSubmitToQueue(token);
            handleSavingResponse(res);
          },
          "expired-callback": () => {
            fallbackRecaptcha.current.firstElementChild.remove();
            setVerifyingRecaptcha(false);
            setRecaptchaFallbackToken(null);
            setResponseMessage("Your ReCaptcha expired. Please try again.");
          },
        });
        setRecaptchaRendered(true);
      }
    } else {
      setResponseMessage(res?.message || "That didn't work. Try again.");
    }

    setSavingSpot(false);
  };

  const handleSubmitToQueue = async (token: string = null) => {
    const recaptchaToken: string = await getRecaptchaToken();
    const encodedClientAgentInfo = await buildClientAgentInfo();
    const res = await fetch(`/.netlify/functions/queue`, {
      method: "POST",
      headers: {
        [HEADER_EMAIL]: emailInput,
        [HEADER_RECAPTCHA]: recaptchaToken,
        [HEADER_RECAPTCHA_FALLBACK]: token || recaptchaFallbackToken,
      },
      body: JSON.stringify({
        clientAgent: encodedClientAgentInfo,
      }),
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));

    return res;
  };

  // Send the user's email to a queue.
  const handleSaving = async (e: Event | null) => {
    e && e.preventDefault();

    if (0 === emailInput.length) {
      setTimeoutResponseMessage("Email cannot be blank!");
      return;
    }

    if (!validateEmail(emailInput)) {
      setTimeoutResponseMessage("Sorry, that's not a valid email!");
      return;
    }

    if (emailInput.includes("+")) {
      setTimeoutResponseMessage(
        "Sorry, we do not support email addresses with the (+) character. Try again!"
      );
      return;
    }

    if (!emailChecked) {
      setTimeoutResponseMessage(
        "Sorry, you must agree to receive email alerts!"
      );
      return;
    }

    setSavingSpot(true);
    setResponseMessage("Submitting email...");
    const res = await handleSubmitToQueue();
    handleSavingResponse(res);
  };

  // Sends the user's email and auth code (via URL params) to the server for verification.
  const handleAuthenticating = async (e: Event) => {
    e.preventDefault();

    setAuthenticating(true);
    try {
      const res: VerifyResponseBody = await fetch(
        "/.netlify/functions/verify",
        {
          headers: {
            [HEADER_EMAIL]: activeEmail,
            [HEADER_EMAIL_AUTH]: activeAuthCode,
          },
        }
      )
        .then((res) => res.json())
        .catch((e) => console.log(e));

      const { error, verified, message, token, data } = res;
      if (!error && verified && token && data) {
        setAccessTokenCookie(res, data.exp);
        window.location.href = "/mint";
      }

      if (!verified && error && message) {
        setResponseMessage(message);
        setExpired(true);
      }
    } catch (e) {
      setTimeoutResponseMessage("Hmm, try that again. Something went wrong.");
      console.log(e);
    }

    setAuthenticating(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8 lg:mb-12">
        <div className="w-1/2 text-center">
          <h4 className="text-lg text-dark-350 mb-4">Blockchain Load</h4>
          <span
            className={`font-bold text-4xl ${
              stateData?.chainLoad > 0.8 ? "" : "text-primary-100"
            }`}
            style={{
              color: stateData?.chainLoad > 0.8 ? "red" : "",
            }}
          >
            {null === stateData && "Loading..."}
            {null !== stateData &&
              !stateData.error &&
              `${(stateData.chainLoad * 100).toFixed(2)}%`}
            {null !== stateData && stateData.error && "N/A"}
          </span>
        </div>
        <div className="w-1/2 text-center">
          <h4 className="text-lg text-dark-350 mb-4">Current Waitlist</h4>
          <span className={`font-bold text-4xl text-primary-100`}>
            {null === stateData && "Loading..."}
            {null !== stateData && !stateData.error && (
              <span>{stateData.accessQueueSize ?? 0}</span>
            )}
            {null !== stateData && stateData.error && "N/A"}
          </span>
        </div>
      </div>
      {submitted ? (
        <div className="bg-dark-100 rounded-lg shadow-lg p-8 block">
          <h3 className="text-2xl text-white text-center mb-4 font-bold">
            <div className="w-12 h-12 text-3xl bg-primary-200 text-white flex items-center justify-center rounded mx-auto mb-4">
              &#10003;
            </div>
            Success!
          </h3>
          <p className="text-lg text-center text-dark-350">{responseMessage}</p>
          <p className="text-center text-lg">
            Make sure to{" "}
            <strong className="underline">
              add hello@adahandle.com to your safe-senders list, as well as
              check your spam folder!
            </strong>
          </p>
          <p className="text-center text-lg font-bold">
            You may close this window!
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-2xl text-white text-center mb-4">
            {activeEmail && activeAuthCode ? (
              <>Agree to the Terms</>
            ) : (
              <>Enter the Queue</>
            )}
          </h3>
          {!activeEmail && !activeAuthCode && stateData?.chainLoad > 0.8 && (
            <p className="text-center">
              You may experienced delayed delivery times while we wait for the
              blockchain load to fall below 80%.
            </p>
          )}
          {activeEmail && activeAuthCode && (
            <p className="text-lg text-center">
              Almost there! Just make sure to agree to the terms of use before
              purchasing your Handles. This information is important!
            </p>
          )}
          <form
            onSubmit={(e) => e.preventDefault()}
            ref={form}
            className="bg-dark-100 border-dark-300 rounded-t-lg"
          >
            {activeEmail && activeAuthCode ? (
              <AgreeInputs
                touChecked={touChecked}
                setTouChecked={setTouChecked}
                refundsChecked={refundsChecked}
                setRefundsChecked={setRefundsChecked}
              />
            ) : (
              <EmailInputs
                savingSpot={savingSpot}
                emailInput={emailInput}
                emailChecked={emailChecked}
                handleOnChange={handleOnChange}
                setEmailChecked={setEmailChecked}
              />
            )}
            {activeEmail ? (
              <Button
                className={`w-full rounded-t-none`}
                buttonStyle={"primary"}
                type="submit"
                disabled={authenticating || !touChecked || !refundsChecked}
                onClick={handleAuthenticating}
              >
                {authenticating && "Authenticating..."}
                {!authenticating && "Enter Minting Portal"}
              </Button>
            ) : (
              <Button
                className={`w-full rounded-t-none`}
                buttonStyle={"primary"}
                type="submit"
                disabled={savingSpot || !emailChecked || verifyingRecaptcha}
                onClick={handleSaving}
              >
                {savingSpot && "Entering queue..."}
                {!savingSpot && verifyingRecaptcha && "Waiting..."}
                {!authenticating &&
                  !savingSpot &&
                  !verifyingRecaptcha &&
                  "Submit"}
              </Button>
            )}
          </form>
          {responseMessage && (
            <p className="my-2 text-center">{responseMessage}</p>
          )}
          <div
            className="flex items-center justify-center my-4"
            ref={fallbackRecaptcha}
          />
          {activeEmail && activeAuthCode && !expired && (
            <p className="text-center mt-2">
              <Link to={"/mint/"} className="text-primary-100">
                Start Over
              </Link>
            </p>
          )}
          {expired && (
            <p className="my-2 text-center">
              <Link
                to="/mint"
                onClick={() => {
                  setResponseMessage("");
                  setAuthInput(null);
                  setEmailInput(null);
                }}
                className="text-primary-100"
              >
                Re-Enter the Queue
              </Link>
            </p>
          )}
        </>
      )}
    </>
  );
};
