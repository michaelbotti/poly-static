import React, { useState } from "react";
import { initializeApp } from "@firebase/app";

import Layout from "../components/layout";
import SEO from "../components/seo";

const firebaseConfig = {
    apiKey: "AIzaSyAjLfhecwnZJyl-lv8FdXasQZGmYEEJ-wc",
    authDomain: "ada-handle-reserve.firebaseapp.com",
    projectId: "ada-handle-reserve",
    storageBucket: "ada-handle-reserve.appspot.com",
    messagingSenderId: "995478242710",
    appId: "1:995478242710:web:7b01129b47c6e82e1e49b7",
  };
  
  const app = initializeApp(firebaseConfig);

function IndexPage() {
    const [user, setUser] = useState<string|null>(null);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
  return (
    <Layout>
      <SEO title="Reserve With Twitter" />

      <section id="top" className="z-0 relative">
        <div className="grid grid-cols-12 content-center text-center mb-48">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3 relative z-10">
            <h2 className="inline-block mt-8 mb-4 text-5xl font-bold leading-none">
              {user ? `@${user}` : <>Reserve Your<br/> Twitter Handle</>}
            </h2>
            <div className="max-w-1/2 mx-auto">
                {user ? (
                    <p className="text-xl mb-8"><strong>Done!</strong> Your Twitter handle is now reserved for you.<br/> <a className="font-bold text-primary-100" href="https://twitter.com/intent/tweet?text=I%20just%20reserved%20my%20custom%20%23Cardano%20address%20at%20%40adahandle!%20Check%20it%20out%3A%20https%3A//adahandle.com">Share on Twitter</a></p>
                ) : (
                    <>
                        <p className="text-xl mb-8 lg:w-1/2 mx-auto">
                            And we'll reserve your handle for <strong>up to two weeks</strong> after our launch day (to be announced).
                        </p>
                        <button onClick={async () => {
                            const { getAuth, getAdditionalUserInfo, signInWithPopup, TwitterAuthProvider } = await import("firebase/auth");
                              const provider = new TwitterAuthProvider();
                              const auth = getAuth();
                              signInWithPopup(auth, provider)
                                  .then((result) => {
                                      const { username } = getAdditionalUserInfo(result);
                                      setAuthenticated(true);
                                      setUser(username);
                                  }).catch((error) => {
                                      console.log(error);
                                  });
                        }} className={`px-8 py-4 rounded text-white bg-primary-100 ${authenticated ? 'hidden' : ''}`}>Authenticate With Twitter</button>
                        <p className="mt-8 lg:w-1/2 mx-auto"><small><strong>Note:</strong> reserving your handle via Twitter will require you to authenticate again on launch day to unlock your handle.</small></p>
                    </>
                )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default IndexPage;
