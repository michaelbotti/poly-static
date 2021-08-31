import PropTypes from "prop-types";
import React from "react";

import Header from "./header";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 overflow-hidden">
      <Header />

      <main className="w-full max-w-5xl px-4 pt-8 mx-auto md:px-8 md:pt-16">
        {children}
      </main>

      <footer className="bg-blue-700 bg-dark-100 pt-16">
        <nav className="flex justify-center max-w-4xl p-4 mx-auto text-sm md:p-8">
          <p className="text-white">
            Created with ❤️ by{` `}
            <a
              className="font-bold no-underline"
              href="https://twitter.com/CryptosCalvin"
              target="_blank"
              rel="noopener noreferrer"
            >
              @CryptosCalvin
            </a> and{` `}
            <a
              className="font-bold no-underline"
              href="https://twitter.com/conraddit"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Conrad
            </a>
          </p>
        </nav>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
