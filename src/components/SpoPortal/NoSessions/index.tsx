import React, {
  FormEvent,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";
import { useDebounce } from "use-debounce";
import { Link } from "gatsby";

import {
  HEADER_HANDLE,
  HEADER_IS_SPO,
  HEADER_JWT_ACCESS_TOKEN,
  HEADER_RECAPTCHA,
  HEADER_TWITTER_ACCESS_TOKEN,
} from "../../../../src/lib/constants";
import { HandleMintContext } from "../../../context/mint";
import { isValid } from "../../../lib/helpers/nfts";
import LogoMark from "../../../images/logo-single.svg";
import { Loader } from "../../Loader";
import {
  getAccessTokenFromCookie,
  getAllCurrentSPOSessionData,
  getRecaptchaToken,
  setSessionTokenCookie,
} from "../../../lib/helpers/session";
import { SessionResponseBody } from "../../../../netlify/functions/session";
import { useSyncAvailableStatus } from "../../../lib/hooks/search";

export const NoSessions = ({ className = "", ...rest }) => {
  const { fetching, handleResponse, setHandleResponse, handle, setHandle } =
    useContext(HandleMintContext);
  const { setCurrentIndex } = useContext(HandleMintContext);
  const [fetchingSession, setFetchingSession] = useState<boolean>(false);
  const [debouncedHandle] = useDebounce(handle, 600);
  const handleInputRef = useRef(null);

  const currentSessions = getAllCurrentSPOSessionData();

  const nextIndex =
    currentSessions.findIndex((session) => session === false) + 1;

  useSyncAvailableStatus(debouncedHandle, true);

  // Handles the input validation and updates.
  const onUpdateHandle = async (newHandle: string) => {
    const valid = isValid(newHandle);
    if (!valid && 0 === handle.length) {
      return;
    }

    if (valid) {
      setHandle(newHandle.toLowerCase());
    }
  };

  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  /**
   * Handles the form submission to start a session.
   *
   * @param {FormEvent} e
   * @returns
   */
  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const recaptchaToken: string = await getRecaptchaToken();

    const headers = new Headers();
    headers.append(HEADER_HANDLE, handle);
    headers.append(HEADER_RECAPTCHA, recaptchaToken);
    headers.append(HEADER_IS_SPO, "true");
    const accessToken = getAccessTokenFromCookie();
    if (accessToken) {
      headers.append(HEADER_JWT_ACCESS_TOKEN, accessToken.token);
    }

    try {
      setFetchingSession(true);
      const session = await fetch("/.netlify/functions/session", {
        headers,
      });
      const sessionResponse: SessionResponseBody = await session.json();
      if (!sessionResponse.error) {
        setHandle("");
        setSessionTokenCookie(
          sessionResponse,
          new Date(sessionResponse.data.exp),
          nextIndex
        );

        console.log("nextIndex", nextIndex);

        setCurrentIndex(nextIndex);
        return;
      }

      setHandleResponse({
        available: false,
        twitter: false,
        message: sessionResponse.message,
      });
      setFetchingSession(false);
    } catch (e) {
      console.log(e);
      setHandle("");
      setHandleResponse({
        available: false,
        message: "Something went wrong. Please refresh the page.",
        twitter: false,
      });
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
        Securing Your SPO Handle
      </h2>
      <hr className="w-12 border-dark-300 border-2 block my-8" />
      <>
        <form {...rest} onSubmit={handleOnSubmit}>
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
        </form>
        <p className="text-sm mt-8">
          Once you start a session,{" "}
          <strong>it will be active for approximately 24 hours</strong>. We use
          several safeguards to ensure this is hard to get around.{" "}
          <a
            className="text-primary-100"
            href="https://discord.gg/cWYA7xwmMp"
            target="_blank"
          >
            ask in our Discord
          </a>
          .
        </p>
      </>
    </>
  );
};
