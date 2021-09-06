import { Link } from "gatsby";
import { useLocation } from '@reach/router';
import React, { useState, FC } from "react";

import Button from './button';
import Logo from './logo';
import WalletButton from "./WalletButton";
import { useEffect } from "react";

interface HeaderProps {
  className?: string;
}

interface NavItem {
  route: string;
  title: string;
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
    route: `/mint`,
    title: 'Purchase'
  }
];

const Header: FC<HeaderProps> = ({ className }) => {
  const [isExpanded, toggleExpansion] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location?.pathname]);

  return (
    <header className={className}>
      <div className="flex flex-wrap items-center justify-between p-4 mx-auto md:p-8">
        <Link to="/">
          <h1 className="flex items-center text-dark-100 no-underline">
            <span className="sr-only">$handle</span>
            <Logo className="w-20 mr-1" />
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
                  className={'block mt-4 text-dark-300 hover:text-primary-200 no-underline md:inline-block md:mt-0 md:ml-6 dark:text-dark-400'}
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
        {('/mint' || '/app') !== currentPath ? (
          <Button className="hover:bg-primary-200" internal={true} href={'/mint'}>Launch App</Button>
        ) : <WalletButton />}
      </div>
    </header>
  );
}

export default Header;
