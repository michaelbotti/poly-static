import React, { useRef, useState, useContext, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import { Link } from "gatsby";

import { QueueResponseBody } from "../../../netlify/functions/queue";
import { VerifyResponseBody } from "../../../netlify/functions/verify";
import { HEADER_PHONE, HEADER_PHONE_AUTH, HEADER_RECAPTCHA } from "../../lib/constants";
import { useAccessOpen } from "../../lib/hooks/access";
import Button from "../button";
import { getRecaptchaToken, setAccessTokenCookie } from "../../lib/helpers/session";
import { HandleMintContext } from "../../context/mint";

import "react-phone-number-input/style.css";

const getCachedPhoneNumber = (): string => {
  const cache = window.localStorage.getItem('ADA_HANDLE_PHONE');
  return typeof cache === 'string' ? atob(cache) : null;
};
const setCachedPhoneNumber = (phone: string): void => window.localStorage.setItem('ADA_HANDLE_PHONE', btoa(phone));
const deleteCachedPhoneNumber = (): void => window.localStorage.removeItem('ADA_HANDLE_PHONE');

export const HandleQueue = (): JSX.Element => {
  const { betaState } = useContext(HandleMintContext);
  const [savingSpot, setSavingSpot] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [action, setAction] = useState<"save" | "auth">("save");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>(null);
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [authInput, setAuthInput] = useState<string>("");
  const [touChecked, setTouChecked] = useState<boolean>(false);
  const [refundsChecked, setRefundsChecked] = useState<boolean>(false);
  const [locallyCachedPhone, setLocallyCachedPhone] = useState<string>(getCachedPhoneNumber());

  const form = useRef(null);
  const [, setAccessOpen] = useAccessOpen();

  useEffect(() => {
    console.log(locallyCachedPhone);
    if (typeof locallyCachedPhone === 'string' && locallyCachedPhone.length > 0) {
      setAction('auth');
    }
  }, []);

  const setTimeoutResponseMessage = (message: string) => {
    setResponseMessage(message);
    setTimeout(() => {
      setResponseMessage("");
    }, 4000);
  };

  /**
   * Send the user's phone number to a queue.
   * We set a cron on the backend to allow users
   * in via batches of 20, depending on current
   * chain load.
   */
  const handleSaving = async (e: Event) => {
    e.preventDefault();

    if (0 === phoneInput.length) {
      setTimeoutResponseMessage("Phone number cannot be blank.");
      return;
    }

    setSavingSpot(true);
    setResponseMessage("Submitting phone number...");

    const recaptchaToken: string = await getRecaptchaToken();
    const res: QueueResponseBody = await fetch(`/.netlify/functions/queue`, {
      method: "POST",
      headers: {
        [HEADER_PHONE]: phoneInput,
        [HEADER_RECAPTCHA]: recaptchaToken
      },
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));

    if (res.updated) {
      // We have to update local state as well as local storage.
      setCachedPhoneNumber(phoneInput);
      setLocallyCachedPhone(phoneInput);

      // Clear the input field for phone.
      setPhoneInput('');

      // Update response state.
      setResponseMessage(`Success! You'll receive a text once it's your turn. Remember, once you receive an auth code, it is ONLY valid for 10 minutes!`);
      setSubmitted(true);
    } else {
      setTimeoutResponseMessage(res?.message || "That didn't work. Try again.");
    }

    setSavingSpot(false);
  };

  /**
   * Sends the authentication code along with the user's
   * phone number to the backend, where we verify and
   * sign an access JWT token in the case that they pass.
   * The JWT token expires automatically in 30 minutes
   * after generating.
   */
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
            [HEADER_PHONE]: phoneInput || locallyCachedPhone,
            [HEADER_PHONE_AUTH]: authInput,
          },
        }
      )
        .then((res) => res.json())
        .catch((e) => console.log(e));

      const { error, verified, message, token, data } = res;
      if (!error && verified && token && data) {
        deleteCachedPhoneNumber();
        setAccessTokenCookie(res, data.exp);
        window.location.reload();
      }

      if (!verified && error && message) {
        setResponseMessage(message);
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
      <h3 className="text-2xl text-white text-center mb-4">
        {locallyCachedPhone ? <>Gain Access</> : <>Register Your Spot</>}
      </h3>
      {!submitted && (
        <>
          <div className="flex align-center justify-stretch bg-dark-200 rounded-t-lg border-2 border-b-0 border-dark-300">
            {!locallyCachedPhone && (
              <button
                onClick={() => {
                  setAuthInput("");
                  setAction("save");
                }}
                className={`text-white text-center p-4 w-1/2 rounded-lg rounded-r-none rounded-bl-none border-b-4 ${
                  "save" === action
                    ? "border-primary-100"
                    : "opacity-80 border-dark-200"
                }`}
              >
                Enter Phone Number
              </button>
            )}
            <button
              onClick={() => {
                setAction("auth");
              }}
              className={`text-white text-center p-4 rounded-lg rounded-l-none rounded-br-none border-b-4 ${
                "auth" === action
                  ? "border-primary-100"
                  : "opacity-80 border-dark-200"
              } ${locallyCachedPhone ? 'w-full' : 'w-1/2'}`}
            >
              Enter Access Code
            </button>
          </div>
          <form onSubmit={(e) => e.preventDefault()} ref={form} className="bg-dark-100 border-dark-300">
            {action === 'save' && !locallyCachedPhone && (
              <PhoneInput
                name="phone"
                disabled={savingSpot}
                placeholder={"Your mobile number..."}
                className={`focus:ring-0 focus:ring-opacity-0 border-2 outline-none form-input bg-dark-100 border-dark-300 px-6 py-4 text-xl w-full`}
                defaultCountry="US"
                value={phoneInput}
                // @ts-ignore
                onChange={setPhoneInput}
              />
            )}
            {"auth" === action && (
              <>
                <input
                  name="auth"
                  data-lpignore="true"
                  disabled={authenticating}
                  placeholder={"Your 6 digit code..."}
                  type="number"
                  onChange={(e) => setAuthInput(e.target.value)}
                  value={authInput}
                  className={`focus:ring-0 focus:ring-opacity-0 border-2 outline-none form-input bg-dark-100 border-dark-300 px-6 py-4 text-xl w-full appearance-none`}
                />
                <div className="flex items-center text-sm bg-dark-100 border-dark-300 border-l-2 border-r-2 p-4 pb-0">
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
                <div className="flex items-center text-sm bg-dark-100 border-dark-300 border-l-2 border-r-2 p-4 pt-0">
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
            <Button
              className={`w-full rounded-t-none`}
              buttonStyle={"primary"}
              type="submit"
              disabled={authenticating || savingSpot || ("auth" === action && (!touChecked || !refundsChecked))}
              onClick={
                touChecked && refundsChecked && "auth" === action
                  ? handleAuthenticating
                  : handleSaving
              }
            >
              {authenticating && "Authenticating..."}
              {savingSpot && "Entering queue..."}
              {!authenticating && !savingSpot && "Submit"}
            </Button>
          </form>
        </>
      )}
      {locallyCachedPhone && !submitted && (
        <p className="text-center mt-2">
          Never submitted your phone number?<br/>
          <button className="text-primary-100" onClick={() => {
            setAction('save');

            // Update local state and local storage.
            deleteCachedPhoneNumber();
            setLocallyCachedPhone(null);
          }}>Reset Local Cache</button>
        </p>
      )}
      {responseMessage && (
        <>
          <p className="my-2 text-center">{responseMessage}</p>
          {!savingSpot && (
            <p className="text-center">
              {submitted && (
                <Button size="small" className="mt-2" onClick={() => {
                  setAction('auth');
                  setSubmitted(false);
                  setResponseMessage(null);
                }}>Dismiss This Message</Button>
              )}
            </p>
          )}
        </>
      )}
    </>
  );
};
