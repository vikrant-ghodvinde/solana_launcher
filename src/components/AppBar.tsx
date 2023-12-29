import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAutoConnect } from "../contexts/AutoConnectProvider";

export const AppBar: FC = (props) => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [menuToggle, setMenuToggle] = useState(false);
  const router = useRouter();
  const routes = [
    { title: "Home", path: "/" },
    { title: "Manage Tokens", path: "/manage" },
    { title: "Token Pools", path: "/update" },
    // { title: "Token Metadata", path: "/metadata" },
    // { title: "Launched Tokens", path: "/launched-tokens" },
  ];
  return (
    <nav className="bg-black sticky w-full z-20 top-0 start-0 border-b border-gray-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer">
            <Image
              src="/images/solana_logo.png"
              width={40}
              height={40}
              className="h-10"
              alt="Flowbite Logo"
            />
            <span className="hidden sm:inline-block self-center text-xl font-bold whitespace-nowrap bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent">
              SolanaLauncher
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4 lg:order-2 space-x-3 lg:space-x-0 rtl:space-x-reverse">
          <WalletMultiButton className="relative text-black bg-primary-gradient text-sm px-6 py-2 text-center rounded z-10 before:absolute before:w-full before:h-full before:bg-primary-gradient-reversed before:top-0 before:left-0 before:-z-10 before:opacity-0 before:hover:opacity-100 before:transition-all before:delay-150 font-semibold capitalize overflow-hidden" />
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden 
            focus:outline-none"
            aria-controls="navbar-sticky"
            aria-expanded="false"
            onClick={() => setMenuToggle(!menuToggle)}
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${
            menuToggle ? "" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <ul
            className="flex flex-col p-4 lg:p-0 mt-4 font-regular rounded-lg lg:space-x-6 rtl:space-x-reverse 
          lg:flex-row lg:mt-0 lg:border-0 bg-black"
          >
            {routes.map((menuItem) => (
              <li
                key={menuItem.path}
                className={
                  router.pathname === menuItem.path
                    ? "block py-2 px-3 text-black bg-primary-color rounded lg:bg-transparent lg:text-primary-color lg:p-0 lg:dark:text-primary-color"
                    : "block py-2 px-3 text-white rounded hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-primary-color lg:p-0 lg:dark:hover:text-primary-color dark:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                }
              >
                <Link href={menuItem.path}>{menuItem.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {props.children}
    </nav>
  );
};
