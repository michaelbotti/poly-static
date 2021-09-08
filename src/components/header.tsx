import { Link } from "gatsby";
import React, { useState } from "react";

import logo from '../images/logo.svg';

function Header() {
  const [isExpanded, toggleExpansion] = useState(false);

  return (
    <header>
      <div className="flex flex-wrap items-center justify-between max-w-5xl p-4 mx-auto md:p-8">
        <Link to="/">
          <h1 className="flex items-center text-dark-100 no-underline">
            <img className="w-6 h-6 mr-1" src={logo} alt="ADA" />
            <span className="text-xl font-bold tracking-tight">
              handle
            </span>
          </h1>
        </Link>

        {/* <button
          className="items-center block px-3 py-2 text-white border border-white rounded md:hidden"
          onClick={() => toggleExpansion(!isExpanded)}
        >
          <svg
            className="w-3 h-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button> */}

        <nav
          className={`${
            isExpanded ? `block` : `hidden`
          } md:block md:items-center w-full md:w-auto`}
        >
          {[
            {
              route: `/#simple`,
              title: `Simple`,
            },
            {
              route: `/#secure`,
              title: `Secure`,
            },
            {
              route: `/#non-custodial`,
              title: `Non-Custodial`
            },
            {
              route: '/#roadmap',
              title: 'Roadmap'
            },
            {
              route: '/reserve',
              title: 'Reserve With Twitter!'
            }
          ].map((link) => (
            <Link
              className={
                link.route === '/reserve'
                  ? 'block mt-4 font-bold no-underline text-white hover:bg-dark-300 bg-dark-200 px-4 rounded py-2 md:inline-block md:mt-0 md:ml-6'
                  : 'block mt-4 font-bold text-dark-300 hover:text-dark-100 no-underline md:inline-block md:mt-0 md:ml-6'
              }
              key={link.title}
              to={link.route}
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <Link
          className="block mt-4 font-bold no-underline text-white hover:bg-dark-300 bg-dark-200 px-4 rounded py-2 md:inline-block md:mt-0 md:ml-6 md:hidden"
          to={`/reserve`}
        >
          Reserve Handle
        </Link>
      </div>
    </header>
  );
}

export default Header;
