import { Link } from "gatsby";
import React, { FC, useEffect, useState } from "react";

import Header from "../components/header";
import Form from '../components/mailchimp';
import { HandleMintContextProvider } from '../context/mint';

const Layout: FC = ({ children }): JSX.Element => {
  const [mintPage, setMintPage] = useState<boolean>(false);

  useEffect(() => {
    setMintPage(window.location.pathname.includes('mint'));
  });

  return (
    <HandleMintContextProvider>
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
            &copy; 2021 ADA Handle • <Link className="text-primary-100" to="/tou">Terms of Use</Link>
          </p>
        </footer>
      </div>
    </HandleMintContextProvider>
  );
}

export default Layout;
