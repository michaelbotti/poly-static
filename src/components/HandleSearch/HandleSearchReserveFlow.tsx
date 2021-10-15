import React, {
  FormEvent,
  useContext,
  useRef,
  useEffect,
  useState
} from "react";
import { useDebounce } from "use-debounce";
import { Link, navigate } from "gatsby";
import Cookie from 'js-cookie';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { requestToken } from "../../lib/firebase";
import {
  COOKIE_SESSION_PREFIX,
  HEADER_APPCHECK,
  HEADER_HANDLE,
  HEADER_IP_ADDRESS,
  HEADER_JWT_ACCESS_TOKEN,
  HEADER_RECAPTCHA,
  HEADER_TWITTER_ACCESS_TOKEN,
  RECAPTCHA_SITE_KEY,
} from "../../../src/lib/constants";
import { HandleMintContext } from "../../context/mint";
import { isValid } from "../../lib/helpers/nfts";
import { useSyncAvailableStatus } from "../../lib/hooks/search";
import LogoMark from "../../images/logo-single.svg";
import { HandleSearchConnectTwitter } from "./";
import { Loader } from "../Loader";
import { SessionResponseBody } from '../../../netlify/functions/session';
import { getAccessTokenFromCookie, getIpAddress, getSessionDataCookie, setSessionTokenCookie } from "../../lib/helpers/session";
import { SESSION_KEY } from "../../lib/helpers/session";

export const HandleSearchReserveFlow = ({ className = "", ...rest }) => {
  const {
    fetching,
    handleResponse,
    setHandleResponse,
    handle,
    setHandle,
    twitterToken
  } = useContext(HandleMintContext);
  const [fetchingSession, setFetchingSession] = useState<boolean>(false);
  const [debouncedHandle] = useDebounce(handle, 600);
  const handleInputRef = useRef(null);

  const currentSessions = getSessionDataCookie();
  const nextIndex = currentSessions.length + 1;

  useSyncAvailableStatus(debouncedHandle);

  useEffect(() => {
    fetch('/.netlify/functions/session')
  }, []);

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

    console.log(appCheckToken)

    const headers = new Headers();
    headers.append(HEADER_HANDLE, handle);
    headers.append(HEADER_RECAPTCHA, recaptchaToken);
    headers.append(HEADER_APPCHECK, appCheckToken);
    headers.append(HEADER_JWT_ACCESS_TOKEN, getAccessTokenFromCookie());

    /**
     * Add a Twitter auth token to verify on the server. This is
     * valid only if a user successfully reserved their handle
     * with Twitter.
     */
    if (twitterToken) {
      headers.append(HEADER_TWITTER_ACCESS_TOKEN, twitterToken);
    }

    /**
     * We use basic IP filtering to restrict active sessions. This is
     * more reliable since users are required to authenticate with a
     * phone number before gaining an access token.
     */
    const ip = await getIpAddress();
    if (ip) {
      headers.append(HEADER_IP_ADDRESS, ip);
    }

    try {
      setFetchingSession(true);
      const session = await fetch("/.netlify/functions/session", { headers });
      const sessionJSON: SessionResponseBody = await session.json();
      console.log(sessionJSON);
      if (!sessionJSON.error) {
        setHandle("");
        setSessionTokenCookie(
          sessionJSON,
          new Date(sessionJSON.data.exp),
          nextIndex
        );

        navigate("/sessions", { state: { sessionIndex: nextIndex }});
        return;
      }

      setHandleResponse({
        available: false,
        twitter: !!twitterToken,
        message: sessionJSON.message
      });
      setFetchingSession(false);
    } catch (e) {
      console.log(e);
      setHandle('');
      setHandleResponse({
        available: false,
        message: 'Something went wrong. Please refresh the page.',
        twitter: false,
      })
      setFetchingSession(false);
    }
  };

  // Autofocus the input field on load.
  useEffect(() => {
    (handleInputRef?.current as HTMLInputElement | null)?.focus();
  }, []);

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
      {currentSessions.length > 0
        ? (
          <>
            <p className="text-lg">
              You have{" "}
              <Link to="/sessions" className="text-primary-100">
                active sessions
              </Link>{" "}
              in progress! In order to make distributing handles as fair as possible, we're limiting{" "}
              how many you can purchase at a time. Don't worry, it goes fast.
            </p>
          </>
        ) : (
          <>
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
          </>
        )
      }

      <hr className="w-12 border-dark-300 border-2 block my-8" />

      {currentSessions.length === 3 ? (
        <>
          <p className="text-lg">
            <strong>Wow, you got speed!</strong> You're clearly a pro,{" "}
            but let's slow down. Try again in about {
              // Get the soonest expiring session.
              dayjs(
                currentSessions
                  .sort((a, b) => a.data.exp < b.data.exp ? -1 : 1)
                  [0]
                  .data.exp * 1000
              ).fromNow(true)
            }.
          </p>
          <p className="text-lg"><Link className="text-primary-100" to="/sessions">See Active Sessions &rarr;</Link></p>
        </>
      ) : (
        <>
          <form {...rest} onSubmit={handleOnSubmit}>
            {currentSessions.length !== 3 && (
              <p className="text-lg">
                <strong>You have {3 - currentSessions.length} session{2 === currentSessions.length ? '' : 's'} left.</strong>
              </p>
            )}
            <div className="relative mb-2">
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
            Once you start a session,{" "}
            <strong>it will be active for approximately 10 minutes</strong>.{" "}
            We use several safeguards to ensure this is hard to get around.{" "}
            You get a max of up to 3 sessions at any one time. If you have questions,{" "}
            <a className="text-primary-100" href="https://discord.gg/cWYA7xwmMp" target="_blank">ask in our Discord</a>.
          </p>
        </>
      )}
    </>
  );
};
