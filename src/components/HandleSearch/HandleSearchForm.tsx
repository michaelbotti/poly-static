import React, { useContext, useCallback, useState, useRef } from "react";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";

import { ALLOWED_CHAR } from "../../lib/constants";
import { HandleMintContext } from "../../context/handleSearch";
import { useCheckIfAvailable } from "../../hooks/nft";
import LogoMark from "../../images/logo-single.svg";

export const HandleSearchForm = ({ className = "", ...rest }) => {
  const { fetching, handleResponse, handle, setHandle } =
    useContext(HandleMintContext);
  const [debouncedHandle] = useDebounce(handle, 500);
  const handleInputRef = useRef(null);

  // Check if availabe, debounced.
  useCheckIfAvailable(debouncedHandle);

  const onUpdateHandle = (newHandle: string) => {
    const valid = !!newHandle.match(ALLOWED_CHAR);
    if (!valid && 0 === handle.length) {
      return;
    }

    if (valid) {
      setHandle(newHandle);
    }
  };

  // Focus input on load.
  useEffect(() => {
    handleInputRef.current.focus();
  }, []);

  return (
    <form {...rest}>
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
          onChange={(e) => onUpdateHandle(e.target.value)}
        />
        <p className="my-2 h-4 absolute bottom-0 right-0 transform translate-y-8">
          <small>
            {fetching && <span className="block">Checking...</span>}
            {!fetching && handleResponse?.message && (
              <span className="block">
                {handleResponse?.message}
                {!handleResponse?.available && handleResponse?.link && (
                  <a
                    href={handleResponse?.link}
                    className="ml-2 text-primary-100"
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
        value={"Checkout"}
        className={`${
          !fetching && true === handleResponse?.available
            ? `cursor-pointer bg-primary-200 text-dark-100`
            : `cursor-not-allowed bg-dark-300`
        } form-input rounded-lg p-6 w-full mt-12 font-bold text-dark-100`}
      />
    </form>
  );
};
