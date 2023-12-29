import { FC, useState, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Metadata, PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import Image from "next/image";

export const GetMetadata: FC = () => {
  const { connection } = useConnection();
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenMetadata, setTokenMetadata] = useState(null);
  const [logo, setLogo] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const getMetadata = useCallback(
    async (form) => {
      const tokenMint = new PublicKey(form.tokenAddress);
      const metadataPDA = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), PROGRAM_ID.toBuffer(), tokenMint.toBuffer()],
        PROGRAM_ID
      )[0];
      console.log(metadataPDA.toBase58());
      const metadataAccount = await connection.getAccountInfo(metadataPDA);
      console.log(metadataAccount);
      const [metadata, _] = await Metadata.deserialize(metadataAccount.data);
      console.log(metadata);
      let logoRes = await fetch(metadata.data.uri);
      let logoJson = await logoRes.json();
      let { image } = logoJson;
      setTokenMetadata({ tokenMetadata, ...metadata.data });
      setLogo(image);
      setLoaded(true);
      setTokenAddress("");
    },
    [tokenAddress]
  );

  return (
    <>
      <div className="max-w-screen-sm mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative col-span-2">
            <label htmlFor="" className="block text-white mb-2">
              Token Address
            </label>
            <input
              type="text"
              value={tokenAddress}
              className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3"
              placeholder="Token Address"
              onChange={(e) => setTokenAddress(e.target.value)}
            />
          </div>
          <div className="relative col-span-2 text-center">
            <button
              type="button"
              className="relative text-black bg-primary-gradient text-sm px-6 py-2 text-center rounded z-10 before:absolute before:w-full before:h-full before:bg-primary-gradient-reversed before:top-0 before:left-0 before:-z-10 before:opacity-0 before:hover:opacity-100 before:transition-all before:delay-150 font-semibold capitalize overflow-hidden"
              onClick={() => getMetadata({ tokenAddress })}
            >
              Get Metadata
            </button>
          </div>
        </div>
      </div>

      {!loaded ? undefined : (
        <div className="relative max-w-screen-lg mx-auto bg-dark rounded-md mt-10">
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-white font-semibold capitalize">Logo</dt>
            <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
              <Image
                src={logo}
                alt="token"
                width={200}
                height={200}
                className="w-1/4 h-full inline-block object-center object-cover lg:w-1/4 lg:h-full"
              />
            </dd>
          </div>
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-white font-semibold capitalize">Name</dt>
            <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
              {tokenMetadata.name}
            </dd>
          </div>
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-white font-semibold capitalize">Symbol</dt>
            <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
              {tokenMetadata.symbol || "undefined"}
            </dd>
          </div>
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-white font-semibold capitalize">URI</dt>
            <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
              <a href={tokenMetadata.uri} target="_blank" rel="noreferrer">
                {tokenMetadata.uri}
              </a>
            </dd>
          </div>
        </div>
      )}
    </>
  );
};
