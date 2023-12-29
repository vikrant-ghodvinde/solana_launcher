import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const LaunchedTokensTable: FC = ({}) => {
  return (
    <div className="relative w-full">
      <div className="relative overflow-x-auto">
        <table className="table">
          <thead className="text-base text-white">
            <tr>
              <th className="bg-dark text-sm font-semibold">Token</th>
              <th className="bg-dark text-sm font-semibold">Contract</th>
              <th className="bg-dark text-sm font-semibold">Total Supply</th>
              <th className="bg-dark text-sm font-semibold">USD Market Cap</th>
              <th className="bg-dark text-sm font-semibold">Pooled Solana</th>
              <th className="bg-dark text-sm font-semibold">Current Solana</th>
              <th className="bg-dark text-sm font-semibold">Is Mutable</th>
              <th className="bg-dark text-sm font-semibold">Is Mintable</th>
              <th className="bg-dark text-sm font-semibold">Launch</th>
              <th className="bg-dark text-sm font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-5">
                <div className="block w-full">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/1.jpg"
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full"
                    />
                    Psmoke [Psmoke-SOL]
                  </div>
                </div>
              </td>
              <td className="py-5">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-tip="DFN6yZr14dNkJaGuchu57qkusJ59LDEvrKotoZNKf2NB"
                  className="relative block text-primary-color before:transition-all before:duration-300 before:text-black before:text-xs before:font-semibold before:opacity-0 before:hover:opacity-100 before:absolute before:bottom-6 before:left-2/4 before:translate-x-[-50%] before:py-1 before:px-2 before:rounded-md before:bg-primary-color before:content-[attr(data-tip)]"
                >
                  DFN...2NB
                </a>
              </td>
              <td className="py-5">10M</td>
              <td className="py-5">$945</td>
              <td className="py-5">5 SOL</td>
              <td className="py-5">6.4528 SOL</td>
              <td className="py-5">Yes</td>
              <td className="py-5">No</td>
              <td className="py-5">26 Dec 2023</td>
              <td className="py-5">
                <span className="relative text-black bg-primary-gradient text-xs px-4 py-1.5 text-center rounded before:rounded z-10 before:absolute before:w-full before:h-full before:bg-primary-gradient-reversed before:top-0 before:left-0 before:-z-10 before:opacity-0 before:hover:opacity-100 before:transition-all before:delay-150 font-semibold capitalize overflow-hidden">
                  <Link href="/token-details/123">view</Link>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
