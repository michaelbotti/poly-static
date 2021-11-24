import { Link } from "gatsby";
import React, { FC, useEffect, useState } from "react";
import { useLocation } from "@reach/router";

import Header from "../components/header";
import Form from '../components/mailchimp';
import { HandleMintContextProvider } from '../context/mint';

const Layout: FC = ({ children }): JSX.Element => {
  const [mintPage, setMintPage] = useState<boolean>(false);
  const [isTestnet, setIsTestnet] = useState<boolean>(false);
  const { hostname } = useLocation();

  useEffect(() => {
    setMintPage(window.location.pathname.includes('mint'));

    if (hostname.includes('testnet') || hostname.includes('localhost')) {
      setIsTestnet(true);
    }
  }, [hostname]);

  return (
    <HandleMintContextProvider>
      {isTestnet && (
        <div className="bg-primary-100 text-white px-8 py-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="mb-0"><strong><u>TESTNET!</u></strong> The environment you are using is on testnet!<br/> This means no transactions or Handles purchased are real, and are for testing purposes only.</p>
          </div>
        </div>
      )}
      <Header showMint={!mintPage} className="bg-dark-100 text-dark-400 text-gray-900" />
      <div className="flex flex-col min-h-screen font-sans bg-dark-100 text-dark-400 text-gray-900 overflow-hidden">

        <main className="w-full px-4 pt-8 mx-auto md:px-8 md:pt-16">
          {children}
        </main>

        {'undefined' !== typeof window && window.location.pathname !== '/mint' && (
          <div className="bg-dark-200 py-16">
            <div className="max-w-5xl mx-auto text-center">
              <h4 className="mb-8 text-white font-bold text-3xl">Never Miss an Update</h4>
              <Form />
            </div>
          </div>
        )}

        <footer className="bg-dark-100 pt-16">
          <p className="text-center text-dark-350">
            &copy; 2021 ADA Handle • <Link className="text-primary-100" to="/tou">Terms of Use</Link> • PolicyID: <a href="https://cardanoscan.io/tokenPolicy/d5df2ddadd04b98215f7c3ea94fd9ab8194968f94d9d32377fd26a7c" target="_blank" rel="noopener nofollow">d5df2ddadd04b98215f7c3ea94fd9ab8194968f94d9d32377fd26a7c</a>
          </p>
        </footer>
      </div>
    </HandleMintContextProvider>
  );
}

export default Layout;
