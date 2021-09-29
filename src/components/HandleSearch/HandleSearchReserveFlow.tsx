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
  HEADER_APPCHECK,
  HEADER_HANDLE,
  HEADER_IP_ADDRESS,
  HEADER_RECAPTCHA,
  HEADER_TWITTER_ACCESS_TOKEN,
  RECAPTCHA_SITE_KEY,
} from "../../../src/lib/constants";
import { HandleMintContext } from "../../context/mint";
import { isValid } from "../../lib/helpers/nfts";
import { useSyncAvailableStatus } from "../../lib/hooks/handle";
import LogoMark from "../../images/logo-single.svg";
import { HandleSearchConnectTwitter } from "./";
import { Loader } from "../Loader";
import { SessionResponseBody } from '../../../netlify/functions/session';
import { getSessionDataCookie } from "../../lib/helpers/session";
import { SESSION_KEY } from "../../lib/helpers/session";
import { HandleResponseBody } from "../../lib/helpers/search";

export const HandleSearchReserveFlow = ({ className = "", ...rest }) => {
  const {
    fetching,
    handleResponse,
    setHandleResponse,
    handle,
    setHandle,
    twitterToken,
  } = useContext(HandleMintContext);
  const [fetchingSession, setFetchingSession] = useState<boolean>(false);
  const [debouncedHandle] = useDebounce(handle, 600);
  const handleInputRef = useRef(null);

  const currentSessions = getSessionDataCookie();
  const nextIndex = currentSessions.length + 1;

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

    // Fire up wallet end-points.
    fetch('/.netlify/functions/wallet-address');
    fetch('/.netlify/functions/wallet-mint');

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
    if (sessionJSON.data) {
      setHandle("");
      const res = Cookie.set(
        `${SESSION_KEY}_${nextIndex}`,
        JSON.stringify(sessionJSON),
        {
          sameSite: 'strict',
          secure: true,
          expires: new Date(Math.floor(sessionJSON.data.payload.exp * 1000))
        }
      )
      console.log(res);
      navigate("/sessions", { state: { sessionIndex: nextIndex }});
    } else {
      setHandleResponse(sessionJSON);
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
            Once you start a session,{" "}
            <strong>it will be active for approximately 10 minutes</strong>.{" "}
            We use cookies and other means to ensure this is hard to get around.{" "}
            You get a max of up to 3 sessions at any one time. If you have questions,{" "}
            <Link className="text-primary-100" to="/support">send us an email</Link>.
          </p>
        </>
      )}
    </>
  );
};
