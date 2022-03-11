import React, { useContext, useState } from "react";
import { useLocation } from "@reach/router";
import { parse } from "query-string";
import { HandleMintContext } from "../context/mint";
import { HEADER_PASSWORD_PROTECTION } from "../lib/constants";

export const PasswordProtection = () => {
  const { setPasswordAllowed } = useContext(HandleMintContext);

  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  const { search } = useLocation();
  const { p } = parse(search);

  const submitPassword = async () => {
    setError(null);
    try {
      const headers = new Headers();
      headers.append(HEADER_PASSWORD_PROTECTION, value);

      const session = await fetch("/.netlify/functions/passwordProtection", {
        headers,
      });

      const { allowed } = await session.json();
      if (allowed) {
        setPasswordAllowed(true);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    }
  };

  const onPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitPassword();
  };

  if (!p) {
    return null;
  }

  return (
    <>
      <form onSubmit={onPasswordSubmit}>
        <input
          style={{
            borderColor: error ? "red" : "",
          }}
          type="text"
          className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-16 py-2 text-3xl w-full`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </>
  );
};
