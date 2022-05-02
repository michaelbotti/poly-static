import { Box } from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { SpoVerifyResponseBody } from "../../../../netlify/functions/spoVerify";
import { getAccessTokenCookieName } from "../../../../netlify/helpers/util";
import { HandleMintContext } from "../../../context/mint";

import { HEADER_RECAPTCHA } from "../../../lib/constants";
import {
  getAccessTokenFromCookie,
  setSessionTokenCookie,
  setSPOSessionTokenCookie,
} from "../../../lib/helpers/session";
import Button from "../../button";

interface SpoChallengeResponseBody {
  error: boolean;
  message: string;
  domain?: string;
  nonce?: string;
}

export const VerifyForm = (): JSX.Element => {
  const { setCurrentIndex } = useContext(HandleMintContext);
  const [responseMessage, setResponseMessage] = useState<string>(null);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [poolId, setPoolId] = useState("");
  const [vrfKey, setVrfKey] = useState("");
  const [vKHash, setVKHash] = useState("");
  const [signature, setSignature] = useState("");
  const [copying, setCopying] = useState(false);

  const form = useRef(null);

  const setTimeoutResponseMessage = (message: string) => {
    setResponseMessage(message);
    setTimeout(() => {
      setResponseMessage("");
    }, 4000);
  };

  const performChallenge = async (): Promise<void> => {
    setLoading(true);
    const headers = new Headers();
    const accessToken = getAccessTokenFromCookie(true);

    if (accessToken) {
      headers.append(getAccessTokenCookieName(true), accessToken.token);
    }

    try {
      const res: SpoChallengeResponseBody = await fetch(
        "/.netlify/functions/spoChallenge",
        {
          headers,
        }
      ).then((res) => res.json());

      const { error, message, nonce, domain } = res;
      if (!error && nonce) {
        setNonce(nonce);
        setDomain(domain);
      }

      setError(true);
      setResponseMessage(message);
    } catch (e) {
      setTimeoutResponseMessage("Hmm, try that again. Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const performVerify = async (): Promise<void> => {
    debugger;
    setLoading(true);
    const headers = new Headers();
    const accessToken = getAccessTokenFromCookie(true);

    if (accessToken) {
      headers.append(getAccessTokenCookieName(true), accessToken.token);
    }

    try {
      const res: SpoVerifyResponseBody = await fetch(
        "/.netlify/functions/spoVerify",
        {
          method: "POST",
          headers,
          body: JSON.stringify({ signature }),
        }
      ).then((res) => res.json());

      const { error, message, token, data, address } = res;
      if (!error) {
        setSPOSessionTokenCookie(
          { error, token, data, address },
          new Date(data.exp),
          1
        );
        setCurrentIndex(1);
      }

      setError(true);
      setResponseMessage(message);
    } catch (e) {
      console.log("ERROR", e);
      setTimeoutResponseMessage("Hmm, try that again. Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitChallengeForm = async (e: Event | null): Promise<void> => {
    e && e.preventDefault();
    performChallenge();
  };

  const handleSubmitVerifyForm = async (e: Event | null): Promise<void> => {
    e && e.preventDefault();
    performVerify();
  };

  const handleCopy = async () => {
    const copyText = `$ cncli sign --domain ${domain} --nonce ${nonce} --pool-vrf-skey /path/to/my/pool.vrf.skey`;
    navigator.clipboard.writeText(copyText);
    setCopying(true);
    setTimeout(() => {
      setCopying(false);
    }, 1000);
  };

  return (
    <>
      <div className="col-span-12">
        <div className="shadow-lg rounded-lg border-2 border-primary-100 p-4 md:p-8 mb-8">
          <h3 className="text-white text-3xl font-bold text-center mb-4">
            Verify SPO Pool
          </h3>
          <p>
            We need you to prove that you own the pools you registered with.
          </p>
          <p>
            We will do so using CIP-0022. Please review the information at the
            referenced link. We also suggest that you watch this video.
          </p>
          {!nonce || !domain ? (
            <form onSubmit={(e) => e.preventDefault()} ref={form}>
              <p>
                <label
                  htmlFor="poolId"
                  className="block text-gray-700 text-med font-bold mb-2"
                >
                  Bech32 Pool ID
                </label>
                <input
                  type="text"
                  className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-16 py-2 text-2xl w-full`}
                  id="poolId"
                  value={poolId}
                  onChange={(e) => setPoolId(e.target.value)}
                />
              </p>
              <p>
                <label
                  htmlFor="vrfKey"
                  className="block text-gray-700 text-med font-bold mb-2"
                >
                  cborHex-encoded VRF Key
                </label>
                <input
                  type="text"
                  className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-16 py-2 text-2xl w-full`}
                  id="vrfKey"
                  value={vrfKey}
                  onChange={(e) => setVrfKey(e.target.value)}
                />
              </p>
              <p>
                <label
                  htmlFor="vKHash"
                  className="block text-gray-700 text-med font-bold mb-2"
                >
                  Hex-encoded VKey Hash
                </label>
                <input
                  type="text"
                  className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-16 py-2 text-2xl w-full`}
                  id="vKHash"
                  value={vKHash}
                  onChange={(e) => setVKHash(e.target.value)}
                />
              </p>
              <Button
                className={`w-full`}
                buttonStyle={"primary"}
                type="submit"
                disabled={poolId === "" || vrfKey === "" || vKHash === ""}
                onClick={handleSubmitChallengeForm}
              >
                {loading && "Waiting..."}
                {!loading && "Start Challenge"}
              </Button>

              {responseMessage && (
                <p className="my-2 text-center">{responseMessage}</p>
              )}
            </form>
          ) : null}
          {nonce && domain ? (
            <form onSubmit={(e) => e.preventDefault()} ref={form}>
              <p>Run `cncli sign` using the following command:</p>
              <p>
                <div className="relative" style={{ paddingRight: "64px" }}>
                  <div className="overflow-hidden overflow-x-auto p-4 rounded-none rounded-tl-lg shadow-inner shadow-lg bg-dark-300 overflow-hidden pr-24 border-2 border-b-0 border-primary-100">
                    $ cncli sign --domain {domain} --nonce {nonce}{" "}
                    --pool-vrf-skey /path/to/my/pool.vrf.skey
                  </div>
                  <button
                    onClick={handleCopy}
                    className="absolute top-0 right-0 h-full w-16 bg-primary-100 rounded-tr-lg"
                  >
                    <svg
                      className={`w-full height-full p-5 ${
                        copying ? "hidden" : "block"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="#fff"
                        d="M18.783 13.198H15.73a.78.78 0 010-1.559h2.273V3.652H7.852v.922c0 .433-.349.78-.78.78a.778.778 0 01-.78-.78V2.872c0-.43.349-.78.78-.78h11.711c.431 0 .78.35.78.78v9.546a.781.781 0 01-.78.78z"
                      />
                      <path
                        fill="#fff"
                        d="M12.927 17.908H1.217a.781.781 0 01-.78-.78V7.581c0-.43.349-.78.78-.78h11.709c.431 0 .78.35.78.78v9.546c0 .43-.349.781-.779.781zm-10.93-1.56h10.15V8.361H1.997v7.987z"
                      />
                    </svg>

                    <svg
                      className={`w-full height-full p-5 ${
                        copying ? "block" : "hidden"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="#fff"
                        d="M7.197 16.963h-.002a.773.773 0 01-.544-.227L.612 10.654a.769.769 0 011.09-1.084l5.495 5.536L18.221 4.083a.767.767 0 011.087 0c.301.3.301.787 0 1.087L7.741 16.738a.772.772 0 01-.544.225z"
                      />
                    </svg>
                  </button>
                </div>
              </p>
              <p>This will produce a signature. Add signature below.</p>
              <p>
                <label
                  htmlFor="signature"
                  className="block text-gray-700 text-med font-bold mb-2"
                >
                  Signature
                </label>
                <input
                  type="text"
                  className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-16 py-2 text-2xl w-full`}
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                />
              </p>
              <Button
                className={`w-full`}
                buttonStyle={"primary"}
                type="submit"
                disabled={signature === ""}
                onClick={handleSubmitVerifyForm}
              >
                {loading && "Waiting..."}
                {!loading && "Verify"}
              </Button>

              {responseMessage && (
                <p className="my-2 text-center">{responseMessage}</p>
              )}
            </form>
          ) : null}
        </div>
      </div>
    </>
  );
};
