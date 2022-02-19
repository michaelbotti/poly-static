import React, { useRef, useState, useContext } from "react";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import { parse } from "query-string";

import { VerifyResponseBody } from "../../../netlify/functions/verify";
import { HEADER_EMAIL, HEADER_EMAIL_AUTH } from "../../lib/constants";
import Button from "../button";
import { setAccessTokenCookie } from "../../lib/helpers/session";
import { HandleMintContext } from "../../context/mint";
import { AgreeInputs } from "./AgreeInputs";
import { HowItWorks } from "../HowItWorks";
import { RedirectTo } from "../RedirectTo";

interface Props {
  accessOpen: boolean | null;
}

const validateEmail = (email: string): boolean => {
  const res =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
};

const getActiveEmail = (): string | null => {
  let value = null;
  if (typeof window !== undefined) {
    const { search } = useLocation();
    const { activeEmail } = parse(search) as { activeEmail: string };
    if (activeEmail && validateEmail(activeEmail)) {
      value = activeEmail;
    }
  }

  return value;
};

const getActiveAuthCode = (): string | null => {
  let value = null;
  if (typeof window !== undefined) {
    const { search } = useLocation();
    const { activeAuthCode } = parse(search) as { activeAuthCode: string };
    value = activeAuthCode || null;
  }

  return value;
};

export const HandleAcceptTerms: React.FC<Props> = ({
  accessOpen,
}): JSX.Element => {
  const { stateData } = useContext(HandleMintContext);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>(null);
  const [expired, setExpired] = useState<boolean>(false);
  const [touChecked, setTouChecked] = useState<boolean>(false);
  const [refundsChecked, setRefundsChecked] = useState<boolean>(false);

  const fallbackRecaptcha = useRef(null);

  const activeEmail = getActiveEmail();
  const activeAuthCode = getActiveAuthCode();
  const form = useRef(null);

  const setTimeoutResponseMessage = (message: string) => {
    setResponseMessage(message);
    setTimeout(() => {
      setResponseMessage("");
    }, 4000);
  };

  // Sends the user's email and auth code (via URL params) to the server for verification.
  const handleAuthenticating = async (e: Event) => {
    e.preventDefault();

    setAuthenticating(true);
    try {
      const res: VerifyResponseBody = await fetch(
        "/.netlify/functions/verify",
        {
          headers: {
            [HEADER_EMAIL]: activeEmail,
            [HEADER_EMAIL_AUTH]: activeAuthCode,
          },
        }
      )
        .then((res) => res.json())
        .catch((e) => console.log(e));

      const { error, verified, message, token, data } = res;
      if (!error && verified && token && data) {
        setAccessTokenCookie(res, data.exp);
        window.location.href = "/mint";
      }

      if (!verified && error && message) {
        setResponseMessage(message);
        setExpired(true);
      }
    } catch (e) {
      setTimeoutResponseMessage("Hmm, try that again. Something went wrong.");
      console.log(e);
    }

    setAuthenticating(false);
  };

  const shouldRedirect =
    (!activeEmail || !activeAuthCode) &&
    accessOpen !== null &&
    accessOpen === false;

  return (
    <>
      {shouldRedirect ? (
        <RedirectTo to={"/queue"} />
      ) : (
        <>
          <HowItWorks />
          <div className="col-span-12 md:col-span-6 relative z-10">
            <h3 className="text-2xl text-white text-center mb-4">
              Agree to the Terms
            </h3>
            {!activeEmail && !activeAuthCode && stateData?.chainLoad > 0.8 && (
              <p className="text-center">
                You may experienced delayed delivery times while we wait for the
                blockchain load to fall below 80%.
              </p>
            )}
            {activeEmail && activeAuthCode && (
              <p className="text-lg text-center">
                Almost there! Just make sure to agree to the terms of use before
                purchasing your Handles. This information is important!
              </p>
            )}
            <form
              onSubmit={(e) => e.preventDefault()}
              ref={form}
              className="bg-dark-100 border-dark-300 rounded-t-lg"
            >
              <AgreeInputs
                touChecked={touChecked}
                setTouChecked={setTouChecked}
                refundsChecked={refundsChecked}
                setRefundsChecked={setRefundsChecked}
              />
              <Button
                className={`w-full rounded-t-none`}
                buttonStyle={"primary"}
                type="submit"
                disabled={authenticating || !touChecked || !refundsChecked}
                onClick={handleAuthenticating}
              >
                {authenticating && "Authenticating..."}
                {!authenticating && "Enter Minting Portal"}
              </Button>
            </form>
            {responseMessage && (
              <p className="my-2 text-center">{responseMessage}</p>
            )}
            <div
              className="flex items-center justify-center my-4"
              ref={fallbackRecaptcha}
            />
            {activeEmail && activeAuthCode && !expired && (
              <p className="text-center mt-2">
                <Link to={"/mint/"} className="text-primary-100">
                  Start Over
                </Link>
              </p>
            )}
            {expired && (
              <p className="my-2 text-center">
                <Link
                  to="/mint"
                  onClick={() => {
                    setResponseMessage("");
                  }}
                  className="text-primary-100"
                >
                  Re-Enter the Queue
                </Link>
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
};
