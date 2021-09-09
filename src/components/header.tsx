import { Link } from "gatsby";
import React, { useState } from "react";

import { Logo } from './logo';

function Header() {
  const [isExpanded, toggleExpansion] = useState(false);

  return (
    <header>
      <div className="flex flex-wrap items-center justify-between max-w-5xl p-4 mx-auto md:p-8">
        <Link to="/">
          <h1 className="flex items-center text-dark-100 no-underline">
            <span id="header-logo" className="sr-only">ADA Handle</span>
            <Logo className="w-24 lg:w-36" labeledBy="header-logo" />
          </h1>
        </Link>

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
