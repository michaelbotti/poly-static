import React, { useRef, useState, useContext, useEffect } from "react";
import PhoneInput from "react-phone-number-input";

import { QueueResponseBody } from "../../../netlify/functions/queue";
import { VerifyResponseBody } from "../../../netlify/functions/verify";
import { HEADER_PHONE, HEADER_PHONE_AUTH } from "../../lib/constants";
import { useAccessOpen } from "../../lib/hooks/access";
import Button from "../button";
import { setAccessTokenCookie } from "../../lib/helpers/session";

import "react-phone-number-input/style.css";
import { Link } from "gatsby";
import { HandleMintContext } from "../../context/mint";

const getResponseMessage = (count: number): string => {
  if (count < 20) {
    return `You are ${
      count === 0 ? "first" : `#${count}`
    } in line and part of the next batch! Auth codes are NOT sent immediately, so feel free to come back.`;
  }

  if (count > 20 && count < 200) {
    return `You are #${count} in line. Estimated wait time is between 30 minutes and 2 hours.`;
  }

  return `You are #${count} in line. Estimated wait time is more than 2 hours.`;
};

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

  const form = useRef(null);
  const [, setAccessOpen] = useAccessOpen();

  useEffect(() => {
    const savedPhone = window.localStorage.getItem('ADA_HANDLE_PHONE');
    if (savedPhone) {
      setAction('auth');
      setPhoneInput(savedPhone);
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
   * in via batches of 50, depending on current
   * chain load.
   */
  const handleSaving = async (e: Event) => {
    e.preventDefault();

    if (0 === phoneInput.length) {
      setTimeoutResponseMessage("Phone number cannot be blank.");
      return;
    }

    setSavingSpot(true);
    setResponseMessage("Checking your place in line...");
    const res: QueueResponseBody = await fetch(`/.netlify/functions/queue`, {
      method: "POST",
      headers: {
        [HEADER_PHONE]: phoneInput,
      },
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));

    if (res.updated) {
      const message = getResponseMessage(res.position);
      setResponseMessage(message);
      setSubmitted(true);
      window.localStorage.setItem('ADA_HANDLE_PHONE', phoneInput);
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

    if (authInput.length === 0 || phoneInput.length === 0) {
      setResponseMessage("Inputs must not be empty...");
      return;
    }

    setAuthenticating(true);
    try {
      const res: VerifyResponseBody = await fetch(
        "/.netlify/functions/verify",
        {
          headers: {
            [HEADER_PHONE]: phoneInput,
            [HEADER_PHONE_AUTH]: authInput,
          },
        }
      )
        .then((res) => res.json())
        .catch((e) => console.log(e));

      const { error, verified, message, token, data } = res;
      if (!error && verified && token && data) {
        window.localStorage.removeItem('ADA_HANDLE_PHONE');
        setAccessTokenCookie(res, data.exp);
        setAccessOpen(true);
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
        Register Your Spot
      </h3>
      {!submitted && (
        <>
          <div className="flex align-center justify-stretch bg-dark-200 rounded-t-lg border-2 border-b-0 border-dark-300">
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
            <button
              onClick={() => {
                setAction("auth");
              }}
              className={`text-white text-center p-4 w-1/2 rounded-lg rounded-l-none rounded-br-none border-b-4 ${
                "auth" === action
                  ? "border-primary-100"
                  : "opacity-80 border-dark-200"
              }`}
            >
              Enter Access Code
            </button>
          </div>
          <form onSubmit={(e) => e.preventDefault()} ref={form} className="bg-dark-100 border-dark-300">
            {action === 'save' && (
              <PhoneInput
                name="phone"
                disabled={savingSpot}
                placeholder={"Your mobile number..."}
                className={`focus:ring-0 focus:ring-opacity-0 border-2 outline-none form-input bg-dark-100 border-dark-300 px-6 py-4 text-xl w-full appearance-none`}
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
      {responseMessage && (
        <>
          <p className="my-2 text-lg font-bold text-center">{responseMessage}</p>
          {!savingSpot && (
            <p className="text-center">
              <Button onClick={() => {
                setResponseMessage(null);
                setSubmitted(false)
              }}>Dismiss This Message</Button>
            </p>
          )}
        </>
      )}
    </>
  );
};
