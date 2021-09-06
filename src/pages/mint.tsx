import React, { useState } from "react";

import SEO from "../components/seo";

/**
 * a-z
 * 0-9
 * _
 * -
 */
const ALLOWED_CHAR = new RegExp(/[a-zA-Z|0-9|\-|\_]/g)

function MintPage() {
  const [handle, setHandle] = useState<string>("");
  const [message, setMessage] = useState<string>("message");
  const [isTaken, setIsTaken] = useState<boolean>(false);

  const onUpdateHandle = (handle: string): void => {
      if ('string' !== typeof handle) {
          return;
      }
      
      if (message.length > 0) {
          setMessage('');
      }
      
    const isAllowed = handle.match(ALLOWED_CHAR);
    const handleChars = handle.split('');
      const includesInvalidChars = handleChars.filter(char => !isAllowed.includes(char)).length > 0
    
    if (handle.length > 0 && includesInvalidChars) {
        setMessage('That\'s not allowed.');
        return;
    }

    setHandle(handle);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token: string = await new Promise((res, rej) => {
      if (window?.grecaptcha) {
        window.grecaptcha.ready(function () {
          window.grecaptcha
            .execute("6Ld0QUkcAAAAAN-_KvCv8R_qke8OYxotNJzIg2RP", {
              action: "submit",
            })
            .then(function (token) {
              res(token);
            });
        });
      }
    });

    if (!token) {
      // Try again
      return;
    }

    console.log(token);

    try {
      const res = await fetch("/.netlify/functions/mint/verify", {
        method: "POST",
        headers: {
          "x-recaptcha": token,
        },
      });
      console.log(await res.json());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <SEO title="Home" />
      <section
        id="top"
        className="h-screen z-0 relative"
        style={{
          maxHeight: "700px",
          minHeight: "480px",
        }}
      >
        <div className="grid grid-cols-12 content-center">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3 relative z-10 border border-primary-200 bg-dark-100 rounded-lg shadow-lg">
            <div className="p-8">
              <h2 className="font-bold text-center text-2xl">
                Mint Your Handle
              </h2>
              <hr className="w-12 border-2 border-dark-300 my-10 mx-auto" />
              <form onSubmit={handleSubmit} className="flex flex-col">
                <label htmlFor="" className="form-label mb-4 text-dark-300">
                  Choose a handle:
                </label>
                <input
                  type="text"
                  className="form-input bg-dark-200 border-dark-300 rounded-lg p-6 text-3xl"
                  placeholder="example"
                  value={handle}
                  onChange={(e) => onUpdateHandle(e.target.value)}
                />
                <small>{message}</small>
                <input
                  type="submit"
                  value="Submit"
                  className="form-input bg-primary-200 rounded-lg p-6 w-full mt-8 font-bold text-dark-100"
                />
              </form>
            </div>
          </div>
        </div>
      </section>
      <script
        async
        src="https://www.google.com/recaptcha/api.js?render=6Ld0QUkcAAAAAN-_KvCv8R_qke8OYxotNJzIg2RP"
      />
    </>
  );
}

export default MintPage;
