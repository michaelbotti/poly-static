import { Link } from "gatsby";
import React, { useState, FC, useContext } from "react";
import { HandleMintContext } from "../context/mint";
import Button from "./button";

import Logo from "./logo";
import { Twitter } from "../pages/team";
import { useIsProduction } from "../lib/helpers/env";

interface HeaderProps {
  className?: string;
  showMint?: boolean;
}

interface NavItem {
  route: string;
  title: string;
  external?: boolean;
  highlight?: boolean;
}

const navItems: NavItem[] = [
  {
    route: `/faq`,
    title: `FAQ`,
  },
  {
    route: "/team",
    title: "Team",
  },
  {
    route: "/contact",
    title: "Contact",
  },
  {
    route: "https://github.com/adahandle",
    title: "GitHub",
    external: true,
  },
  {
    route: "https://medium.com/ada-handle",
    title: "Blog",
    external: true,
  },
  {
    route: "/handle-status",
    title: "Handle Status",
  },
  {
    route: "https://ada-handle.gitbook.io/docs/",
    title: "Developers",
    external: true,
  },
];

const Header: FC<HeaderProps> = ({ className, showMint = true }) => {
  const [isExpanded, toggleExpansion] = useState<boolean>(false);
  const [noticeHidden, setNoticeHidden] = useState<boolean>(false);
  const { stateData } = useContext(HandleMintContext);
  const isProduction = useIsProduction();

  return (
    <>
      {!isProduction && (
        <div className="bg-dark-200 text-white px-8 py-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="mb-0">
              This domain uses Cardano's{" "}
              <a
                href="https://testnets.cardano.org/en/testnets/cardano/overview/"
                target="_blank"
              >
                <u>TESTNET environment</u>
              </a>
              . No transactions are real!
            </p>
          </div>
        </div>
      )}

      {stateData &&
        !stateData.error &&
        stateData.chainLoad > 0.8 &&
        !noticeHidden && (
          <div
            className="fixed w-full bottom-0 left-0 px-8"
            style={{ background: "#FFCD59", zIndex: 999999 }}
          >
            <div className="max-w-5xl mx-auto text-center relative py-4">
              <button
                className="m-2 pt-1 pb-3 px-3 absolute top-0 right-0 font-bold rounded-t-lg"
                style={{
                  background: "#FFCD59",
                  transform: "translateY(-100%)",
                }}
                onClick={() => setNoticeHidden(true)}
              >
                X
              </button>
              <p className="mb-0">
                <strong>
                  NOTICE: The Cardano network is currently at{" "}
                  {(stateData.chainLoad * 100).toFixed(1)}% capacity.
                </strong>
                <br /> You may experience slow transaction times, and we cannot
                guarantee immediate Handle delivery. This is a limitation of the
                Cardano protocol, and is{" "}
                <a
                  href="https://iohk.io/en/blog/posts/2022/01/14/how-we-re-scaling-cardano-in-2022/"
                  target="_blank"
                >
                  <u>actively being upgraded</u>
                </a>
                . Thank you for your patience!
              </p>
            </div>
          </div>
        )}
      <header
        className={`bg-dark-100 p-4 md:p-8 ${className}`}
        style={{ minHeight: 120 }}
      >
        <div className="max-w-5xl bg-dark-100 mx-auto flex flex-wrap items-center justify-between">
          <Link to="/">
            <h1 className="flex items-center no-underline">
              <span className="sr-only">ADA Handle</span>
              <Logo />
            </h1>
          </Link>

          <div className="flex items-center justify-center mr-auto relative">
            <button
              className="items-center block px-3 py-2 border-dark-100 text-white border border-white rounded md:hidden"
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
              onClick={() => toggleExpansion(false)}
              className={`${
                isExpanded
                  ? `block absolute bg-dark-200 shadow-lg rounded-lg top-full left-0 px-4 pb-4 z-50 shadow-lg w-48`
                  : `hidden w-full`
              } md:block md:items-center md:w-auto`}
            >
              {navItems.map((link) => {
                return link.external ? (
                  <a
                    className={
                      "block mt-4 text-dark-300 hover:text-primary-200 no-underline md:inline-block md:mt-0 md:ml-6 text-dark-400"
                    }
                    key={link.title}
                    href={link.route}
                    target="_blank"
                    rel="noopener nofollow"
                  >
                    {link.title}
                  </a>
                ) : (
                  <Link
                    className={
                      "block mt-4 text-dark-300 hover:text-primary-200 no-underline md:inline-block md:mt-0 md:ml-6 text-dark-400"
                    }
                    activeClassName="border-primary-200"
                    key={link.title}
                    to={link.route}
                  >
                    {link.title}
                  </Link>
                );
              })}
              <a
                className={
                  "block mt-4 text-dark-300 hover:text-primary-200 no-underline md:inline-block md:mt-0 md:ml-6 text-dark-400"
                }
                href="https://twitter.com/adahandle"
                target="_blank"
                rel="noopener nofollow"
              >
                <Twitter className="inline w-6 h-6 block opacity-60 hover:opacity-100" />
              </a>
            </nav>
          </div>
          {showMint && (
            <Button animate size="small" href={"/mint"}>
              Mint a Handle! &rarr;
            </Button>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
