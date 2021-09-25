import React, {
  FormEvent,
  useContext,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useDebounce } from "use-debounce";
import { Link, navigate } from "gatsby";

import { requestToken } from "../../lib/firebase";
import {
  ALLOWED_CHAR,
  HEADER_APPCHECK,
  HEADER_HANDLE,
  HEADER_IP_ADDRESS,
  HEADER_RECAPTCHA,
  HEADER_TWITTER_ACCESS_TOKEN,
  RECAPTCHA_SITE_KEY,
} from "../../../src/lib/constants";
import {
  ActiveSessionType,
  HandleMintContext,
} from "../../../src/context/handleSearch";
import { useSyncAvailableStatus } from "../../hooks/handle";
import LogoMark from "../../images/logo-single.svg";
import { HandleSearchConnectTwitter } from "./";
import { Loader } from "../Loader";
import { hasSessionDataFromStorage } from "../../pages/session";

export const isValid = (handle: string) =>
  !!handle.match(ALLOWED_CHAR) && handle.length < 15;

export const HandleSearchReserveFlow = ({ className = "", ...rest }) => {
  const {
    fetching,
    handleResponse,
    setHandleResponse,
    currentSessions,
    handle,
    setHandle,
    twitterToken,
  } = useContext(HandleMintContext);
  const [fetchingSession, setFetchingSession] = useState<boolean>(false);
  const [debouncedHandle] = useDebounce(handle, 600);
  const handleInputRef = useRef(null);

  useSyncAvailableStatus(debouncedHandle);

  // Handles the input validation and updates.
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

    const appCheckToken = await requestToken();
    const recaptchaToken: string = await window.grecaptcha.ready(() =>
      window.grecaptcha.execute(
        RECAPTCHA_SITE_KEY,
        { action: "submit" },
        (token: string) => token
      )
    );

    const headers = new Headers();
    headers.append(HEADER_HANDLE, handle);
    headers.append(HEADER_RECAPTCHA, recaptchaToken);
    headers.append(HEADER_APPCHECK, appCheckToken);
    if (twitterToken) {
      headers.append(HEADER_TWITTER_ACCESS_TOKEN, twitterToken);
    }

    const ip = localStorage.getItem("ADAHANDLE_IP");
    if (ip) {
      headers.append(HEADER_IP_ADDRESS, ip);
    }

    setFetchingSession(true);
    const session = await fetch("/.netlify/functions/session", { headers });
    const sessionJSON = await session.json();
    if (sessionJSON.token) {
      setHandle("");
      navigate("/session", { state: sessionJSON });
    } else {
      console.log(sessionJSON);
      setHandleResponse(sessionJSON);
      setFetchingSession(false);
    }
  };

  // Autofocus the input field on load.
  useEffect(() => {
    (handleInputRef?.current as HTMLInputElement | null)?.focus();
  }, []);

  const hasActiveSession = useMemo(hasSessionDataFromStorage, [fetchingSession]);
  const userCurrentSessions = useMemo(() => {
    let sessions = [];
    (async () => {
      let ip = localStorage.getItem("ADAHANDLE_IP");
      if (!ip) {
        ip = await fetch("/.netlify/functions/ip").then((res) => res.json());
      }
      sessions = currentSessions?.filter(
        (session: ActiveSessionType) => session.ip === ip
      );
    })();
    return sessions;
  }, [currentSessions]);

  if (fetchingSession) {
    return (
      <div className="text-center">
        <p className="text-3xl">Fetching session...</p>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <h2 className="font-bold text-3xl text-primary-100 mb-2">
        Securing Your Handle
      </h2>
      <p className="text-lg">
        Purchasing your own handle allows you to easily receive Cardano payments
        just by sharing your handle name, or by sharing your unique link.
      </p>
      <p className="text-lg">
        For more information, see{" "}
        <Link className="text-primary-100" to={"/how-it-works"}>
          How it Works
        </Link>
        .
      </p>
      <hr className="w-12 border-dark-300 border-2 block my-8" />
      {hasActiveSession && userCurrentSessions?.length < 3 && (
        <>
          <p className="text-lg">
            You have an{" "}
            <Link to="/session" className="text-primary-100">
              active session
            </Link>{" "}
            in progress!
          </p>
          <p>
            If you want, you can start {3 - userCurrentSessions?.length} more.
          </p>
          <a
            href="/mint"
            target="_blank"
            className="inline-block cursor-pointer bg-primary-200 text-dark-100 rounded-lg p-6 mt-12 font-bold text-dark-100"
          >
            Open a New Session
          </a>
        </>
      )}
      {hasActiveSession && userCurrentSessions?.length > 2 && (
        <>
          <p className="text-lg">Well, aren't you ambitious!</p>
          <p>
            To make things as fair as possible, all users are limited to 3
            active sessions. Please wait till one closes and try again later.
            Stay awesome!
          </p>
        </>
      )}

      {!hasActiveSession && userCurrentSessions?.length < 3 && (
        <>
          <form {...rest} onSubmit={handleOnSubmit}>
            <div className="relative">
              <img
                src={LogoMark}
                className="absolute h-full left-0 top-0 px-6 py-4 opacity-10"
              />
              <input
                style={{
                  borderColor:
                    !fetching && false === handleResponse?.available
                      ? "orange"
                      : "",
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
                  {fetching && (
                    <span className="block">
                      Checking the Cardano blockchain...
                    </span>
                  )}
                  {!fetching && handleResponse?.message && (
                    <span className="block text-right">
                      {handleResponse?.message && (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: handleResponse.message,
                          }}
                        ></span>
                      )}
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
            {!twitterToken &&
            handleResponse?.twitter &&
            !handleResponse.available ? (
              <HandleSearchConnectTwitter />
            ) : (
              <input
                type="submit"
                value={"Reserve a Session"}
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
            Once you start checking out,{" "}
            <strong>your session will be reserved for 10 minutes</strong>. DO
            NOT close your window, or your session will expire.
          </p>
        </>
      )}
    </>
  );
};
