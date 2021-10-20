import React, { useRef, useState } from 'react';
import PhoneInput from 'react-phone-number-input';

import { QueueResponseBody } from '../../../netlify/functions/queue'
import { VerifyResponseBody } from '../../../netlify/functions/verify'
import { HEADER_PHONE, HEADER_PHONE_AUTH } from '../../lib/constants';
import { useAccessOpen } from '../../lib/hooks/access';
import Button from '../button';
import { setAccessTokenCookie } from '../../lib/helpers/session';

import 'react-phone-number-input/style.css'
import { Link } from 'gatsby';

const getResponseMessage = (count: number): string => {
  if (count < 50) {
    return `Don't go anywhere, you are ${count === 0 ? 'first' : `#${count}`} in line and part of the next batch! Auth codes can take up to 5 minutes to arrive.`;
  }

  if (count > 50 && count < 200) {
    return `You are #${count} in line. Estimated wait time is between 30 minutes and 2 hours.`;
  }

  return `You are #${count} in line. Estimated wait time is more than 2 hours.`;
}

export const HandleQueue = (): JSX.Element => {
  const [savingSpot, setSavingSpot] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [action, setAction] = useState<'save'|'auth'>('save');
  const [responseMessage, setResponseMessage] = useState<string>(null);
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [authInput, setAuthInput] = useState<string>('');
  const [touChecked, setTouChecked] = useState<boolean>(false);

  const form = useRef(null);
  const [, setAccessOpen] = useAccessOpen();

  const setTimeoutResponseMessage = (message: string) => {
    setResponseMessage(message);
    setTimeout(() => {
      setResponseMessage('');
    }, 4000);
  }

  /**
   * Send the user's phone number to a queue.
   * We set a cron on the backend to allow users
   * in via batches of 50, depending on current
   * chain load.
   */
  const handleSaving = async (e: Event) => {
    e.preventDefault();

    if (0 === phoneInput.length) {
      setTimeoutResponseMessage('Phone number cannot be blank.');
      return;
    }

    setSavingSpot(true);
    setResponseMessage('Checking your place in line...');
    const res: QueueResponseBody = await fetch(
      `/.netlify/functions/queue`,
      {
        method: 'POST',
        headers: {
          [HEADER_PHONE]: phoneInput
        }
      }
    )
    .then(res => res.json())
    .catch(e => console.log(e));

    if (res.updated) {
      const message = getResponseMessage(res.position);
      res.position < 50 && setAction('auth');
      setResponseMessage(message);
    } else {
      setTimeoutResponseMessage(res?.message || 'That didn\'t work. Try again.');
    }

    setSavingSpot(false);
  }

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
      setResponseMessage('Inputs must not be empty...');
      return;
    }

    setAuthenticating(true);
    try {
      const res: VerifyResponseBody = await fetch(
        '/.netlify/functions/verify', {
          headers: {
            [HEADER_PHONE]: phoneInput,
            [HEADER_PHONE_AUTH]: authInput
          }
        }
      )
      .then(res => res.json())
      .catch(e => console.log(e));

      const { error, verified, message, token, data } = res;
      if (!error && verified && token && data) {
        setAccessTokenCookie(token, data.exp);
        setAccessOpen(true);
        window.location.reload();
      }

      if (!verified && error && message) {
        setResponseMessage(message);
      }
    } catch (e) {
      setTimeoutResponseMessage('Hmm, try that again. Something went wrong.');
      console.log(e);
    }

    setAuthenticating(false);
  }

  return (
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
          Enter Queue
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
          Authenticate
        </button>
      </div>
      <form onSubmit={(e) => e.preventDefault()} ref={form}>
        <PhoneInput
          name="phone"
          disabled={savingSpot}
          placeholder={"Your mobile number..."}
          className={`${
            "auth" === action ? "rounded-none border-b-0" : ""
          } focus:ring-0 focus:ring-opacity-0 border-2 outline-none form-input bg-dark-100 border-dark-300 px-6 py-4 text-xl w-full appearance-none`}
          defaultCountry="US"
          useNationalFormatForDefaultCountryValue={false}
          value={phoneInput}
          onChange={setPhoneInput}
        />
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
          </>
        )}
        <Button
          className={`w-full rounded-t-none`}
          buttonStyle={"primary"}
          type="submit"
          disabled={authenticating || savingSpot || !touChecked}
          onClick={touChecked && "auth" === action ? handleAuthenticating : handleSaving}
        >
          {authenticating && "Authenticating..."}
          {savingSpot && "Entering queue..."}
          {!authenticating && !savingSpot && "Submit"}
        </Button>
      </form>
      <div className="flex items-center m-2 text-sm">
        <input
          className="form-checkbox text-primary-200 rounded focus:ring-primary-200"
          id="tou"
          name="tou"
          type="checkbox"
          checked={touChecked}
          onChange={() => setTouChecked(!touChecked)}
        />
        <label className="ml-2 text-white" htmlFor="tou">
          I agree to the <Link to="/tou" className="text-primary-100">Terms of Use</Link>
        </label>
      </div>
      {responseMessage && (
        <p className="my-2">
          {responseMessage}
        </p>
      )}
    </>
  );
};
