import React, { FormEvent, useContext, useRef } from "react";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Link } from "gatsby";

import { requestToken } from '../../lib/firebase';
import { ALLOWED_CHAR, RECAPTCHA_SITE_KEY } from "../../lib/constants";
import { HandleMintContext } from "../../context/handleSearch";
import { useCheckIfAvailable } from "../../hooks/nft";
import LogoMark from "../../images/logo-single.svg";
import { HandleSearchConnectTwitter } from "./";
import { AppContext } from "../../context/app";

const isValid = (handle: string) => !!handle.match(ALLOWED_CHAR) && handle.length < 45;

export const HandleSearchReserveFlow = ({ className = "", ...rest }) => {
  const { setErrors } = useContext(AppContext);
  const { fetching, handleResponse, handle, setHandle, twitter, setIsPurchasing } = useContext(HandleMintContext);
  const [debouncedHandle] = useDebounce(handle, 750);
  const handleInputRef = useRef(null);

  // Check if availabe, debounced.
  useCheckIfAvailable(debouncedHandle);

  /**
   * Handles the input validation and updates.
   *
   * @param {string} newHandle
   * @returns {void}
   */
  const onUpdateHandle = async (newHandle: string) => {
    const valid = isValid(newHandle);
    if (!valid && 0 === handle.length) {
      return;
    }

    if (valid) {
      setHandle(newHandle);
    }
  };

  /**
   * Handles the form submission to start a session.
   *
   * @param {FormEvent} e 
   * @returns 
   */
  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!handleResponse.available || !isValid(handle) || 'undefined' === typeof window?.grecaptcha) {
      setErrors(['Hmm, something isn\'t right. Try reloading and try again.']);
      return false;
    }

    const appCheckToken = await requestToken();
    const recaptchaToken: string = await window.grecaptcha.ready(() => window.grecaptcha.execute(
      RECAPTCHA_SITE_KEY,
      { action: 'submit' },
      (token: string) => token
    ));

    console.log(appCheckToken, recaptchaToken);
    // const session = await fetch('/.netlify/functions/session', {
    //   headers: {
    //     'x-handle': handle,
    //     'x-recaptcha': recaptchaToken,
    //     'x-appcheck-token': appCheckToken,
    //     'x-twitter-accessToken': twitter?.credentials?.accessToken
    //   }
    // });

    // console.log(session);
  }

  // Autofocus the input field on load.
  useEffect(() => {
    handleInputRef.current.focus();
  }, []);

  return (
    <>
      <h2 className="font-bold text-3xl text-primary-100 mb-2">
          Securing Your Handle
      </h2>
      <p className="text-lg">
      Purchasing your own handle allows you to easily receive Cardano payments just by sharing your handle name, or by sharing your unique link.
      </p>
      <p className="text-lg">
      For more information, see <Link className="text-primary-100" to={'/how-it-works'}>How it Works</Link>.
      </p>
      <hr className="w-12 border-dark-300 border-2 block my-8" />
      <form {...rest} onSubmit={handleOnSubmit}>
        <div className="relative">
          <img
            src={LogoMark}
            className="absolute h-full left-0 top-0 px-6 py-4 opacity-10"
          />
          <input
            style={{
              borderColor:
                !fetching && false === handleResponse?.available ? "orange" : "",
            }}
            type="text"
            className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-16 py-4 text-3xl w-full`}
            value={handle}
            ref={handleInputRef}
            placeholder="Start typing..."
            onChange={(e) => onUpdateHandle(e.target.value)}
          />
          <p className="my-2 h-4 absolute bottom-0 right-0 transform translate-y-8">
            <small>
              {fetching && <span className="block">Checking the Cardano blockchain...</span>}
              {!fetching && handleResponse?.message && (
                <span className="block text-right">
                  {handleResponse?.message}
                  {!handleResponse?.available && handleResponse?.link && (
                    <a
                      href={handleResponse?.link}
                      className="ml-2 text-primary-100"
                      target="_blank"
                    >
                      View on Cardanoscan &rarr;
                    </a>
                  )}
                </span>
              )}
            </small>
          </p>
        </div>
        {!twitter && handleResponse?.twitter && !handleResponse.available ? (
          <HandleSearchConnectTwitter />
        ) : (
          <input
            type="submit"
            value={"Checkout"}
            disabled={!handleResponse?.available}
            className={`${
              !fetching && true === handleResponse?.available
                ? `cursor-pointer bg-primary-200 text-dark-100`
                : `cursor-not-allowed bg-dark-300`
            } form-input rounded-lg p-6 w-full mt-12 font-bold text-dark-100`}
          />
        )}
      </form>
      <p className="text-sm mt-8">
        Once you start checking out, <strong>your session will be reserved for 10
        minutes</strong>. DO NOT close your window, or your session will expire.
      </p>
    </>
  );
};
