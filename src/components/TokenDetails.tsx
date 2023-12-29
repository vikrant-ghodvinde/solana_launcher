import Image from "next/image";
import { FC } from "react";

export const TokenDetails: FC = () => {
  return (
    <>
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent">
          Psmoke [Psmoke-SOL]
        </h2>
      </div>
      <div className="relative max-w-xs overflow-hidden rounded-xl mx-auto mb-14">
        <Image src="/images/1.jpg" width={500} height={500} alt="" className="w-full object-cover" />
      </div>
      <div className="w-full grid grid-rows-subgrid md:grid-cols-2 lg:grid-cols-3 text-center md:text-start gap-x-6 gap-y-9">
        <div className="relative">
          <h4 className="text-md mb-1 font-bold uppercase">🤩Token</h4>
          <p className="text-sm text-gray-400">Psmoke [Psmoke-SOL]</p>
        </div>
        <div className="relative">
          <h4 className="text-md mb-1 font-bold uppercase">📔Contract</h4>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm break-all text-primary-color"
          >
            DFN6yZr14dNkJaGuchu57qkusJ59LDEvrKotoZNKf2NB
          </a>
        </div>
        <div className="relative">
          <h4 className="text-md mb-1 font-bold uppercase">💲Total Supply</h4>
          <p className="text-sm text-gray-400">
            10M | 💸 Pooled Tokens: 7.8M (78%)
          </p>
        </div>
        <div className="relative">
          <h4 className="text-md mb-1 font-bold uppercase">🤑USD Market Cap</h4>
          <p className="text-sm text-gray-400">
            $945 | 💰 USD Liquidity: $1.5K
          </p>
        </div>
        <div className="relative">
          <h4 className="text-md mb-1 font-bold uppercase">🐬Pooled Solana</h4>
          <p className="text-sm text-gray-400">5 SOL</p>
        </div>
        <div className="relative">
          <h4 className="text-md mb-1 font-bold uppercase">🐳Current Solana</h4>
          <p className="text-sm text-gray-400">6.4528 SOL</p>
        </div>
        <div className="relative">
          <h4 className="text-md mb-1 font-bold uppercase">⚠️Is Mutable</h4>
          <p className="text-sm text-gray-400">Yes</p>
        </div>
        <div className="relative">
          <h4 className="text-md mb-1 font-bold uppercase">🟢Is Mintable</h4>
          <p className="text-sm text-gray-400">No</p>
        </div>
        <div className="relative">
          <h4 className="text-md mb-1 font-bold uppercase">🕐Launch</h4>
          <p className="text-sm text-gray-400">Tue, 26 Dec 2023 06:20:10 GMT</p>
        </div>
      </div>
    </>
  );
};
