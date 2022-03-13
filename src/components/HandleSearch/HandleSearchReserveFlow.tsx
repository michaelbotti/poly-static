import React, {
  FormEvent,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";
import { useDebounce } from "use-debounce";
import { Link } from "gatsby";

import HelpIcon from "@mui/icons-material/Help";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import {
  HEADER_ALL_SESSIONS,
  HEADER_HANDLE,
  HEADER_RECAPTCHA,
  HEADER_TWITTER_ACCESS_TOKEN,
} from "../../../src/lib/constants";
import { HandleMintContext } from "../../context/mint";
import { isValid } from "../../lib/helpers/nfts";
import { useSyncAvailableStatus } from "../../lib/hooks/search";
import LogoMark from "../../images/logo-single.svg";
import { HandleSearchConnectTwitter } from "./";
import { Loader } from "../Loader";
import { SessionResponseBody } from "../../../netlify/functions/session";
import {
  getAccessTokenFromCookie,
  getAllCurrentSessionCookie,
  getAllCurrentSessionData,
  getRecaptchaToken,
  setAllSessionsCookie,
  setSessionTokenCookie,
} from "../../lib/helpers/session";
import { styled } from "@mui/material/styles";
import { getAccessTokenCookieName } from "../../../netlify/helpers/util";

export const HandleSearchReserveFlow = ({ className = "", ...rest }) => {
  const {
    fetching,
    setFetching,
    handleResponse,
    setHandleCost,
    setHandleResponse,
    handle,
    handleCost,
    setHandle,
    twitterToken,
    setTwitterToken,
  } = useContext(HandleMintContext);
  const { setCurrentIndex } = useContext(HandleMintContext);
  const [fetchingSession, setFetchingSession] = useState<boolean>(false);
  const [currentActiveSessions, setCurrentActiveSessions] = useState<
    (false | SessionResponseBody)[]
  >([]);
  const [nextIndex, setNextIndex] = useState(1);
  const [debouncedHandle] = useDebounce(handle, 600);
  const handleInputRef = useRef(null);

  useEffect(() => {
    const currentSessions = getAllCurrentSessionData();
    setCurrentActiveSessions(
      currentSessions.filter((session) => session !== false)
    );
    setNextIndex(currentSessions.findIndex((session) => session === false) + 1);
  }, [handleResponse]);

  useSyncAvailableStatus(debouncedHandle);

  // Handles the input validation and updates.
  const onUpdateHandle = async (newHandle: string) => {
    const valid = isValid(newHandle);
    if (!valid && 0 === handle.length) {
      return;
    }

    if (valid) {
      setFetching(true);
      setHandle(newHandle.toLowerCase());
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

    if (!handleCost) {
      setHandleResponse({
        available: false,
        message: "Unable to determine handle cost.",
        twitter: false,
      });
    }

    const recaptchaToken: string = await getRecaptchaToken();

    const headers = new Headers();
    headers.append(HEADER_HANDLE, handle);
    headers.append(HEADER_RECAPTCHA, recaptchaToken);
    const accessToken = getAccessTokenFromCookie();
    if (accessToken) {
      headers.append(getAccessTokenCookieName(false), accessToken.token);
    }

    const allSessionsCookieData = getAllCurrentSessionCookie();
    if (allSessionsCookieData?.token) {
      headers.append(HEADER_ALL_SESSIONS, allSessionsCookieData.token);
    }

    /**
     * Add a Twitter auth token to verify on the server. This is
     * valid only if a user successfully reserved their handle
     * with Twitter.
     */
    if (twitterToken) {
      headers.append(HEADER_TWITTER_ACCESS_TOKEN, twitterToken);
    }

    try {
      setFetchingSession(true);
      const session = await fetch("/.netlify/functions/session", { headers });
      const sessionResponse: SessionResponseBody = await session.json();
      if (!sessionResponse.error) {
        setHandle("");
        setHandleCost(null);
        setSessionTokenCookie(
          sessionResponse,
          new Date(sessionResponse.data.exp),
          nextIndex
        );

        setAllSessionsCookie({
          token: sessionResponse.allSessionsToken,
          data: {},
        });

        setTwitterToken(null);
        setCurrentIndex(nextIndex);
        return;
      }

      const { message } = sessionResponse;
      const response = {
        available: false,
        twitter: !!twitterToken,
        message,
      };
      setHandleResponse(response);
      setFetchingSession(false);
    } catch (e) {
      console.log(e);
      setHandle("");
      setHandleCost(null);
      setHandleResponse({
        available: false,
        message: "Something went wrong. Please refresh the page.",
        twitter: false,
      });
      setFetchingSession(false);
    }
  };

  const HtmlTooltip = styled(
    ({
      className,
      ...props
    }: {
      className: string;
      title: any;
      children: any;
    }) => <Tooltip {...props} classes={{ popper: className }} />
  )(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#0B132B",
      border: "1px solid #999",
    },
  }));

  // Autofocus the input field on load.
  useEffect(() => {
    (handleInputRef?.current as HTMLInputElement | null)?.focus();
  }, []);

  if (fetchingSession) {
    return (
      <div className="text-center">
        <p className="text-3xl">Fetching...</p>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <h2 className="font-bold text-3xl text-primary-100 mb-2">
        Securing Your Handle
      </h2>
      {currentActiveSessions.length > 0 ? (
        <>
          <p className="text-lg">
            You have {currentActiveSessions.length} active Handle reservations
            in progress! In order to make distributing Handles as fair as
            possible, we're limiting how many you can purchase at a time. Don't
            worry, it goes fast.
          </p>
        </>
      ) : (
        <>
          <p className="text-lg">
            Purchasing your own Handle allows you to easily receive Cardano
            payments just by sharing your Handle name, or by sharing your unique
            link.
          </p>
          <p className="text-lg">
            For more information, see{" "}
            <Link className="text-primary-100" to={"/#how-it-works"}>
              How it Works
            </Link>
            .
          </p>
        </>
      )}

      <hr className="w-12 border-dark-300 border-2 block my-8" />

      {currentActiveSessions.length === 3 ? (
        <>
          <p className="text-lg">
            <strong>Wow, you got speed!</strong> You're clearly a pro, but let's
            slow down. You can only reserve three handles at a time. Once each
            payment confirms another handle can be reserved.
          </p>
        </>
      ) : (
        <>
          <form {...rest} onSubmit={handleOnSubmit}>
            {currentActiveSessions.length !== 3 && (
              <p className="text-lg">
                <strong>
                  You have {3 - currentActiveSessions.length} reservation
                  {2 === currentActiveSessions.length ? "" : "s"} left.
                </strong>
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
                    <span className="block flex items-center text-right">
                      {handleResponse?.message ? (
                        <span>
                          {handleResponse.message}
                          {handleResponse?.reason ? (
                            <HtmlTooltip
                              arrow
                              placement="top"
                              title={
                                <>
                                  <p className="text-sm">
                                    Handle is not allowed for the following
                                    reason: <br /> {handleResponse.reason}
                                  </p>
                                  <p className="text-sm">
                                    Click below for more information.{" "}
                                    <Link
                                      className="text-primary-100"
                                      to={"/faq#faq_12"}
                                    >
                                      FAQ
                                    </Link>
                                    .
                                  </p>
                                </>
                              }
                            >
                              <span>
                                <HelpIcon fontSize="small" />
                              </span>
                            </HtmlTooltip>
                          ) : null}
                        </span>
                      ) : null}
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
                value={"Reserve Handle"}
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
            You get a max of up to 3 Handle reservations at any one time. If you
            have questions,{" "}
            <a
              className="text-primary-100"
              href="https://discord.gg/8b4a48DdgF"
              target="_blank"
            >
              ask in our Discord
            </a>
            .
          </p>
        </>
      )}
    </>
  );
};
