import { FC, useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, PublicKey, Account } from "@solana/web3.js";
import {
  DataV2,
  createUpdateMetadataAccountV2Instruction,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";

export const UpdateMetadata: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [tokenMint, setTokenMint] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [metadata, setMetadata] = useState("");
  // const onClick = useCallback(async (form) => {
  //   try {
  //     const mint = new PublicKey(form.tokenMint)
  //     const metadataPDA = PublicKey.findProgramAddressSync(
  //       [
  //         Buffer.from("metadata"),
  //         PROGRAM_ID.toBuffer(),
  //         mint.toBuffer(),
  //       ],
  //       PROGRAM_ID,
  //     )[0]
  //     // console.log(metadataPDA.toBase58());
  //     const tokenMetadata = {
  //       name: form.tokenName,
  //       symbol: form.symbol,
  //       uri: form.metadata,
  //       sellerFeeBasisPoints: 0,
  //       creators: null,
  //       collection: null,
  //       uses: null
  //     } as unknown as DataV2;

  //     const updateMetadataTransaction = new Transaction().add(
  //       createUpdateMetadataAccountV2Instruction(
  //         {
  //           metadata: metadataPDA,
  //           updateAuthority: publicKey,
  //         },
  //         {
  //           updateMetadataAccountArgsV2: {
  //             data: tokenMetadata,
  //             updateAuthority: publicKey,
  //             primarySaleHappened: true,
  //             isMutable: true,
  //           },
  //         }
  //       )
  //     );
  //     await sendTransaction(updateMetadataTransaction, connection);

  //   } catch (error) {
  //     console.error(`Error sending transaction: ${error}`);
  //     // Handle the error appropriately
  //   }
  // }, [publicKey, connection, sendTransaction]);

  const onClick = useCallback(async () => {
    try {
      const mint = new PublicKey(tokenMint);
      const metadataPDA = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), PROGRAM_ID.toBuffer(), mint.toBuffer()],
        PROGRAM_ID
      )[0];

      const tokenMetadata = {
        name: tokenName,
        symbol: symbol,
        uri: metadata,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      } as unknown as DataV2;

      const updateMetadataTransaction = new Transaction().add(
        createUpdateMetadataAccountV2Instruction(
          {
            metadata: metadataPDA,
            updateAuthority: publicKey,
          },
          {
            updateMetadataAccountArgsV2: {
              data: tokenMetadata,
              updateAuthority: publicKey,
              primarySaleHappened: true,
              isMutable: true,
            },
          }
        )
      );
      const txSig = await sendTransaction(
        updateMetadataTransaction,
        connection
      );
      console.log(`Transaction signature: ${txSig}`);
    } catch (error) {
      console.error(`Error sending transaction: ${error}`);
      // Handle the error appropriately
    }
  }, [
    publicKey,
    connection,
    sendTransaction,
    tokenMint,
    tokenName,
    symbol,
    metadata,
  ]);
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="relative col-span-2 sm:col-span-1">
        <label htmlFor="" className="block text-white mb-2">
          Token Mint Address
        </label>
        <input
          type="text"
          className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3"
          placeholder="Token Mint Address"
          onChange={(e) => setTokenMint(e.target.value)}
        />
      </div>
      <div className="relative col-span-2 sm:col-span-1">
        <label htmlFor="" className="block text-white mb-2">
          Token Name
        </label>
        <input
          type="text"
          className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3"
          placeholder="Token Name"
          onChange={(e) => setTokenName(e.target.value)}
        />
      </div>
      <div className="relative col-span-2 sm:col-span-1">
        <label htmlFor="" className="block text-white mb-2">
          Symbol
        </label>
        <input
          type="text"
          className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3"
          placeholder="Symbol"
          onChange={(e) => setSymbol(e.target.value)}
        />
      </div>
      <div className="relative col-span-2 sm:col-span-1">
        <label htmlFor="" className="block text-white mb-2">
          Metadata Url
        </label>
        <input
          type="text"
          className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3"
          placeholder="Metadata Url"
          onChange={(e) => setMetadata(e.target.value)}
        />
      </div>
      <div className="relative col-span-2 text-center">
        <button
          type="button"
          onClick={() => onClick()}
          className="relative text-black bg-primary-gradient text-sm px-6 py-2 text-center rounded z-10 before:absolute before:w-full before:h-full before:bg-primary-gradient-reversed before:top-0 before:left-0 before:-z-10 before:opacity-0 before:hover:opacity-100 before:transition-all before:delay-150 font-semibold capitalize overflow-hidden"
        >
          Update Metadata
        </button>
      </div>
    </div>
  );
};
