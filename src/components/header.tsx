import { Link } from "gatsby";
import React, { useState, FC } from "react";
import { getAccessTokenFromCookie, getSessionDataCookie } from "../lib/helpers/session";
import { useAccessOpen } from "../lib/hooks/access";

import Logo from './logo';

interface HeaderProps {
  className?: string;
}

interface NavItem {
  route: string;
  title: string;
  highlight?: boolean;
}

const navItems: NavItem[] = [
  {
    route: `/faq`,
    title: `FAQ`,
  },
  {
    route: `/solutions`,
    title: `Solutions`,
  },
  {
    route: '/team',
    title: 'Team'
  },
  {
    route: '/tou',
    title: 'Terms of Use'
  },
  {
    route: `/mint`,
    title: 'Get Your Handle',
    highlight: true
  },
];

const Header: FC<HeaderProps> = ({ className }) => {
  const [isExpanded, toggleExpansion] = useState<boolean>(false);
  const [accessOpen] = useAccessOpen();
  const sessions = getSessionDataCookie();

  return (
    <>
      {accessOpen && sessions.length < 3 && (
        <div className="bg-primary-100 text-white">
          <div className="mx-auto p-4 flex items-center justify-center text-center w-full">
            <p className="m-0">You are in an active purchasing window! <Link className="font-bold underline" to={'/mint'}>Purchase a $handle &rarr;</Link></p>
          </div>
        </div>
      )}
      <header className={className}>
        <div className="flex flex-wrap items-center justify-between p-4 mx-auto md:p-8">
          <Link to="/">
            <h1 className="flex items-center text-dark-100 no-underline">
              <span className="sr-only">$handle</span>
              <Logo />
            </h1>
          </Link>

          <div className="mr-auto">
            <button
              className="items-center block px-3 py-2 border-dark-100 text-dark-100 dark:text-white border dark:border-white rounded md:hidden"
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
              {navItems.map((link) => {
                return (
                  <Link
                    className={link?.highlight
                      ? 'block mt-4 text-dark-300 border border-primary-200 px-4 py-2 rounded-lg font-bold no-underline md:inline-block md:mt-0 md:ml-6 dark:text-dark-400'
                      : 'block mt-4 text-dark-300 hover:text-primary-200 no-underline md:inline-block md:mt-0 md:ml-6 dark:text-dark-400'
                    }
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
        </div>
      </header>
    </>
  );
}

export default Header;
