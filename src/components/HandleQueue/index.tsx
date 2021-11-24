import React, { useRef, useState, useContext, useEffect } from "react";
import { Link } from "gatsby";
import { useLocation } from '@reach/router';
import { parse } from 'query-string';

import { VerifyResponseBody } from "../../../netlify/functions/verify";
import { HEADER_EMAIL, HEADER_EMAIL_AUTH, HEADER_RECAPTCHA } from "../../lib/constants";
import Button from "../button";
import { getRecaptchaToken, setAccessTokenCookie } from "../../lib/helpers/session";
import { HandleMintContext } from "../../context/mint";
import { buildClientAgentInfo } from "../../lib/helpers/clientInfo";


const validateEmail = (email: string): boolean => {
  const res = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}

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
}

const getActiveAuthCode = (): string | null => {
  let value = null;
  if (typeof window !== undefined) {
    const { search } = useLocation();
    const { activeAuthCode } = parse(search) as { activeAuthCode: string };
    value = activeAuthCode || null;
  }

  return value;
}

export const HandleQueue = (): JSX.Element => {
  const { betaState } = useContext(HandleMintContext);
  const [savingSpot, setSavingSpot] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>(null);
  const [emailInput, setEmailInput] = useState<string>("");
  const [authInput, setAuthInput] = useState<string>("");
  const [expired, setExpired] = useState<boolean>(false);
  const [emailChecked, setEmailChecked] = useState<boolean>(false);
  const [touChecked, setTouChecked] = useState<boolean>(false);
  const [refundsChecked, setRefundsChecked] = useState<boolean>(false);

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
    if (value.includes('+')) {
      return;
    }

    setEmailInput(value);
  }

  // Send the user's email to a queue.
  const handleSaving = async (e: Event) => {
    e.preventDefault();

    if (0 === emailInput.length) {
      setTimeoutResponseMessage("Email cannot be blank!");
      return;
    }

    if (!validateEmail(emailInput)) {
      setTimeoutResponseMessage("Sorry, that's not a valid email!");
      return;
    }

    if (emailInput.includes('+')) {
      setTimeoutResponseMessage("Sorry, we do not support email addresses with the (+) character. Try again!");
      return;
    }

    if (!emailChecked) {
      setTimeoutResponseMessage("Sorry, you must agree to receive email alerts!");
      return;
    }

    setSavingSpot(true);
    setResponseMessage("Submitting email...");

    const recaptchaToken: string = await getRecaptchaToken();
    const encodedClientAgentInfo = await buildClientAgentInfo();

    const res = await fetch(`/.netlify/functions/queue`, {
      method: "POST",
      headers: {
        [HEADER_EMAIL]: emailInput,
        [HEADER_RECAPTCHA]: recaptchaToken
      },
      body: JSON.stringify({
        clientAgent: encodedClientAgentInfo,
      }),
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));

    // Clear the input field for email.
    if (res?.updated) {
      setEmailInput('');

      // Update response state.
      setResponseMessage(`You have successfully been entered into the queue! Check your email for further instructions about your access link.`);
      setSubmitted(true);
    } else {
      setTimeoutResponseMessage(res?.message || "That didn't work. Try again.");
    }

    setSavingSpot(false);
  };

  // Sends the user's email and auth code (via URL params) to the server for verification.
  const handleAuthenticating = async (e: Event) => {
    e.preventDefault();

    if (authInput.length !== 6) {
      setResponseMessage("Auth code must be 6 digits.");
      return;
    }

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
        window.location.reload();
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
              betaState?.chainLoad > 0.8 ? "" : "text-primary-100"
            }`}
            style={{
              color: betaState?.chainLoad > 0.8 ? "red" : "",
            }}
          >
            {null === betaState && "Loading..."}
            {null !== betaState && !betaState.error && `${(betaState.chainLoad * 100).toFixed(2)}%`}
            {null !== betaState && betaState.error && "N/A"}
          </span>
        </div>
        <div className="w-1/2 text-center">
          <h4 className="text-lg text-dark-350 mb-4">Current Waitlist</h4>
          <span className={`font-bold text-4xl text-primary-100`}>
            {null === betaState && "Loading..."}
            {null !== betaState && !betaState.error && betaState.position.toLocaleString('en-US')}
            {null !== betaState && betaState.error && "N/A"}
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
          <p className="text-center text-lg font-bold">You may close this window.</p>
        </div>
      ) : (
        <>
          <h3 className="text-2xl text-white text-center mb-4">
            {activeEmail && activeAuthCode ? <>Agree to the Terms</> : <>Get an Access Code</>}
          </h3>
          {activeEmail && activeAuthCode && <p className="text-lg text-center">Almost there! Just make sure to agree to the terms of use before purchasing your Handles. This information is important!</p>}
          <form onSubmit={(e) => e.preventDefault()} ref={form} className="bg-dark-100 border-dark-300 rounded-t-lg">
            {!activeEmail && !activeAuthCode && (
              <>
                <input
                  name="email"
                  disabled={savingSpot}
                  placeholder={"Your email address..."}
                  className={`focus:ring-0 focus:ring-opacity-0 border-2 outline-none form-input bg-dark-100 border-dark-300 rounded-t-lg px-6 py-4 text-xl w-full`}
                  value={emailInput}
                  // @ts-ignore
                  onChange={(e) => handleOnChange(e.target.value)}
                />
                <div className="flex items-center text-sm bg-dark-100 border-dark-300 border-l-2 border-r-2 px-4 py-2">
                  <input
                    className="form-checkbox p-2 text-primary-200 rounded focus:ring-primary-200 cursor-pointer"
                    id="acceptEmail"
                    name="acceptEmail"
                    type="checkbox"
                    checked={emailChecked}
                    onChange={() => setEmailChecked(!emailChecked)}
                  />
                  <label className="ml-2 text-white py-3 cursor-pointer" htmlFor="acceptEmail">
                    I agree to receive email notifications.
                  </label>
                </div>
              </>
            )}
            {activeEmail && activeAuthCode && (
              <>
                <input
                  name="auth"
                  data-lpignore="true"
                  disabled={authenticating}
                  placeholder={"Your 6 digit code..."}
                  type="number"
                  onChange={(e) => setAuthInput(e.target.value)}
                  value={authInput}
                  className={`hidden focus:ring-0 focus:ring-opacity-0 border-2 outline-none form-input bg-dark-100 border-dark-300 px-6 py-4 text-xl w-full appearance-none rounded-t-lg`}
                />
                <div className="flex items-center text-sm bg-dark-100 border-dark-300 border-2 rounded-t-lg p-4 pt-2 pb-0">
                  <input
                    className="form-checkbox p-2 text-primary-200 rounded focus:ring-primary-200 cursor-pointer"
                    id="tou"
                    name="tou"
                    type="checkbox"
                    checked={touChecked}
                    onChange={() => setTouChecked(!touChecked)}
                  />
                  <label className="ml-2 text-white py-3 cursor-pointer" htmlFor="tou">
                    I have read and agree to the ADA Handle {" "}
                    <Link to="/tou" className="text-primary-100">
                      Terms of Use
                    </Link>
                  </label>
                </div>
                <div className="flex items-center text-sm bg-dark-100 border-dark-300 border-l-2 border-r-2 p-4 pb-2 pt-0">
                  <input
                    className="form-checkbox p-2 text-primary-200 rounded focus:ring-primary-200 cursor-pointer"
                    id="refunds"
                    name="refunds"
                    type="checkbox"
                    checked={refundsChecked}
                    onChange={() => setRefundsChecked(!refundsChecked)}
                  />
                  <label className="ml-2 text-white py-3 cursor-pointer" htmlFor="refunds">
                    I understand <strong className="underline">refunds will take up to 14 days to process!</strong>
                  </label>
                </div>
              </>
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
                disabled={savingSpot || !emailChecked}
                onClick={handleSaving}
              >
                {savingSpot && "Entering queue..."}
                {!authenticating && !savingSpot && "Submit"}
              </Button>
            )}
          </form>
          {responseMessage && <p className="my-2 text-center">{responseMessage}</p>}
          {activeEmail && activeAuthCode && !expired && <p className="text-center mt-2"><Link to={'/mint/'} className="text-primary-100">Start Over</Link></p>}
          {expired && <p className="my-2 text-center"><Link to="/mint" onClick={() => {
            setResponseMessage('');
            setAuthInput(null);
            setEmailInput(null);
          }} className="text-primary-100">Re-Enter the Queue</Link></p>}
        </>
      )}
    </>
  );
};
