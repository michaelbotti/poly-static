import React, { useRef, useState } from 'react';
import PhoneInput from 'react-phone-number-input';

import { QueueResponseBody } from '../../../netlify/functions/queue'
import { VerifyResponseBody } from '../../../netlify/functions/verify'
import { HEADER_APPCHECK, HEADER_PHONE, HEADER_PHONE_AUTH } from '../../lib/constants';
import { requestToken } from '../../lib/firebase';
import { useAccessOpen } from '../../lib/hooks/access';
import Button from '../button';
import { setAccessTokenCookie } from '../../lib/helpers/session';

import 'react-phone-number-input/style.css'

interface IntroTextProps {
  count: number;
}

const IntroText = ({ count }: IntroTextProps) => {
  if (null === count) {
    return (
      <span className="text-primary-100 font-bold">Checking your place in line...</span>
    );
  }

  if (count < 50) {
    return (
      <span className="text-primary-100 font-bold">Don't go anywhere, you are up next!</span>
    );
  }

  if (count > 50 && count < 200) {
    return (
      <span className="text-primary-100 font-bold">You are #{count} in line. Estimated wait time is between 30 minutes and 2 hours.</span>
    )
  }

  return (
    <span className="text-primary-100 font-bold">You are #{count} in line. Estimated wait time is more than 2 hours.</span>
  )
}

export const HandleQueue = (): JSX.Element => {
  const [savingSpot, setSavingSpot] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [queue, setQueue] = useState<number>(null);
  const [action, setAction] = useState<'save'|'auth'>('save');
  const [responseMessage, setResponseMessage] = useState<string>(null);
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [authInput, setAuthInput] = useState<string>('');
  const [showPlacement, setShowPlacement] = useState<boolean>(false);

  const form = useRef(null);
  const [, setAccessOpen] = useAccessOpen();

  const setTimeoutResponseMessage = (message: string) => {
    setResponseMessage(message);
    setTimeout(() => {
      setResponseMessage('');
    }, 4000);
  }

  const handleSaving = async (e: Event) => {
    e.preventDefault();

    if (0 === phoneInput.length) {
      setTimeoutResponseMessage('Phone number cannot be blank.');
      return;
    }

    setSavingSpot(true);
    try {
      const appToken = await requestToken();
      const res: QueueResponseBody = await fetch(
        `/.netlify/functions/queue`,
        {
          method: 'POST',
          headers: {
            [HEADER_APPCHECK]: appToken,
            [HEADER_PHONE]: phoneInput
          }
        }
      )
      .then(res => res.json())
      .catch(e => console.log(e));

      setQueue(res?.queue);
      if (res.updated) {
        if (res?.queue < 50) {
          setShowPlacement(true);
          setAction('auth');
          setResponseMessage(`Successfully saved! You should receive a text within five minutes.`);
        }
      } else {
        setTimeoutResponseMessage(res?.message || 'That didn\'t work. Try again.');
      }
    } catch(e) {
      console.log(e);
      setTimeoutResponseMessage(e?.message || 'Something went wrong. Try again.');
    }

    setSavingSpot(false);
  }

  const handleAuthenticating = async (e: Event) => {
    e.preventDefault();

    if (authInput.length === 0 || phoneInput.length === 0) {
      setResponseMessage('Inputs must not be empty...');
      return;
    }

    setAuthenticating(true);
    try {
      const appToken = await requestToken();
      const res: VerifyResponseBody = await fetch(
        '/.netlify/functions/verify', {
          headers: {
            [HEADER_APPCHECK]: appToken,
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
        setShowPlacement(false);
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
        <button onClick={() => {
          setAuthInput('');
          setAction('save')
        }} className={`text-white text-center p-4 w-1/2 rounded-lg rounded-r-none rounded-bl-none border-b-4 ${'save' === action ? 'border-primary-100' : 'opacity-80 border-dark-200'}`}>
          Enter Queue
        </button>
        <button onClick={() => {
          setAction('auth')
        }} className={`text-white text-center p-4 w-1/2 rounded-lg rounded-l-none rounded-br-none border-b-4 ${'auth' === action ? 'border-primary-100' : 'opacity-80 border-dark-200'}`}>
          Authenticate
        </button>
      </div>
      <form onSubmit={(e) => e.preventDefault()} ref={form}>
      <PhoneInput
        name="phone"
        data-lpignore="true"
        disabled={savingSpot}
        placeholder={'Your mobile number...'}
        className={`${'auth' === action ? 'rounded-none border-b-0' : ''} focus:ring-0 focus:ring-opacity-0 border-2 outline-none form-input bg-dark-100 border-dark-300 px-6 py-4 text-xl w-full appearance-none`}
        defaultCountry="US"
        value={phoneInput}
        onChange={setPhoneInput}/>
        {'auth' === action && (
          <>
            <input
              name="auth"
              data-lpignore="true"
              disabled={authenticating}
              placeholder={'Your 6 digit code...'}
              type="number"
              onChange={(e) => setAuthInput(e.target.value)}
              value={authInput}
              className={`focus:ring-0 focus:ring-opacity-0 border-2 outline-none form-input bg-dark-100 border-dark-300 px-6 py-4 text-xl w-full appearance-none`}
            />
          </>
        )}
        <Button
          className={`w-full rounded-t-none ${authenticating || savingSpot ? 'cursor-not-allowed bg-dark-400' : ''}`}
          buttonStyle="primary"
          type="submit"
          disabled={authenticating}
          onClick={'auth' === action ? handleAuthenticating : handleSaving}>
          {authenticating && 'Authenticating...'}
          {savingSpot && 'Entering queue...'}
          {!authenticating && !savingSpot && 'Submit'}
        </Button>
      </form>
      {responseMessage && <p className="my-2">
        {responseMessage}{" "}
        {showPlacement && <IntroText count={queue} />}
      </p>}
    </>
  )
};
