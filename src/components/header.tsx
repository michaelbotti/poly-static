import { Link } from "gatsby";
import React, { useState } from "react";

import logo from '../images/logo.svg';

interface HeaderProps {
  isHome?: boolean;
}

function Header({ isHome = false }) {
  const [isExpanded, toggleExpansion] = useState(false);

  return (
    <header>
      <div className="flex flex-wrap items-center justify-between max-w-5xl p-4 mx-auto md:p-8">
        <Link to="/">
          <h1 className="flex items-center text-dark-100 no-underline">
            {/* <img className="w-6 h-6 mr-1" src={logo} alt="ADA" /> */}
            <span className="font-bold text-primary-200 mr-1 text-2xl">$</span>
            <span className="text-xl font-bold tracking-tight dark:text-white">
              handle
            </span>
          </h1>
        </Link>

        <button
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
        </button>

        <nav
          className={`${
            isExpanded ? `block` : `hidden`
          } md:block md:items-center w-full md:w-auto`}
        >
          {[
            {
              route: `/solutions`,
              title: `Solutions`,
            },
            {
              route: '/team',
              title: 'Team'
            },
            {
              route: `/faq`,
              title: `FAQ`,
            },
            {
              route: `/app`,
              title: `Launch App`
            },
            {
              route: `/mint`,
              title: `Mint Custom @handle`
            }
          ].map((link) => {
            if (!isHome && link.route === '/mint') {
              return null;
            }

            return (
              <Link
                className={'block border-b-2 border-white mt-4 font-bold text-dark-300 hover:text-primary-100 no-underline md:inline-block md:mt-0 md:ml-6 dark:text-dark-400'}
                activeClassName="border-primary-200"
                key={link.title}
                to={link.route}
              >
                {link.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  );
}

export default Header;
