import { FC, useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
} from "@solana/spl-token";
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { notify } from "utils/notifications";
import useUserSOLBalanceStore from "stores/useUserSOLBalanceStore";
import Image from "next/image";

export const CreateToken: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [tokenImage, setTokenImage] = useState("");
  const [symbol, setSymbol] = useState("");
  const [metadata, setMetadata] = useState("");
  const [amount, setAmount] = useState("");
  const [decimals, setDecimals] = useState(1);
  const [mintAuthority, setMintAuthority] = useState("");
  const [freezeAuthority, setFreezeAuthority] = useState("");
  const [mintAuthorityToggle, setMintAuthorityToggle] = useState(false);
  const [freezeAddressToggle, setFreezeAddressToggle] = useState(false);
  const wallet = useWallet();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setTokenImage(reader.result);
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  useEffect(() => {
    if (mintAuthorityToggle) {
      if (mintAuthority !== null) {
        if (mintAuthority.length === 44) {
          if (
            mintAuthority.length === 44 &&
            PublicKey.isOnCurve(new PublicKey(mintAuthority).toBuffer())
          ) {
            setMintAuthority(mintAuthority);
            notify({ type: "success", message: `${mintAuthority}` });
          } else {
            notify({
              type: "error",
              message: `provide the valid solana address!!!`,
            });
          }
        }
      }
    } else {
      // // Mint Authority is not enabled, set mintAuthority to SystemProgram.programId
      setMintAuthority(null);
    }
    console.log(mintAuthority);
  }, [mintAuthorityToggle, mintAuthority]);

  useEffect(() => {
    if (freezeAddressToggle) {
      if (freezeAuthority !== null) {
        if (freezeAuthority.length === 44) {
          if (
            freezeAuthority.length === 44 &&
            PublicKey.isOnCurve(new PublicKey(freezeAuthority).toBuffer())
          ) {
            setFreezeAuthority(freezeAuthority); // Corrected to setFreezeAuthority
            notify({ type: "success", message: `${freezeAuthority}` });
          } else {
            notify({
              type: "error",
              message: `Provide a valid Solana address!!!`,
            });
          }
        }
      }
    } else {
      setFreezeAuthority(null);
    }
    console.log(freezeAuthority);
  }, [freezeAddressToggle, freezeAuthority]);

  const onClick = useCallback(
    async (form) => {
      if (
        !form.tokenName ||
        !form.symbol ||
        !form.metadata ||
        !form.amount ||
        !form.decimals
      ) {
        notify({ type: "error", message: `All Fields are required !!!!` });
      } else {
        const mintAuthority =
          form.mintAuthority !== null
            ? new PublicKey(form.mintAuthority)
            : null;
        const freezeAuthority =
          form.freezeAuthority !== null
            ? new PublicKey(form.freezeAuthority)
            : null;
        let mintOption = mintAuthority || SystemProgram.programId;
        if (mintAuthorityToggle === true && !mintAuthority) {
          throw new Error("Invalid mintAuthority");
        }
        let freezeOption = freezeAuthority || SystemProgram.programId;
        if (freezeAddressToggle === true && !freezeAuthority) {
          throw new Error("Invalid freezeAuthority");
        }
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const mintKeypair = Keypair.generate();
        const tokenATA = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          publicKey
        );
        const createMetadataInstruction =
          createCreateMetadataAccountV3Instruction(
            {
              metadata: PublicKey.findProgramAddressSync(
                [
                  Buffer.from("metadata"),
                  PROGRAM_ID.toBuffer(),
                  mintKeypair.publicKey.toBuffer(),
                ],
                PROGRAM_ID
              )[0],
              mint: mintKeypair.publicKey,
              payer: publicKey,
              updateAuthority: publicKey,
              mintAuthority: publicKey, // Set mintAuthority to the desired authority
            },
            {
              createMetadataAccountArgsV3: {
                data: {
                  name: form.tokenName,
                  symbol: form.symbol,
                  uri: form.metadata,
                  creators: null,
                  sellerFeeBasisPoints: 0,
                  uses: null,
                  collection: null,
                },
                isMutable: false,
                collectionDetails: null,
              },
            }
          );

        const amount = BigInt(form.amount) * BigInt(10 ** form.decimals);
        const createNewTokenTransaction = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports: lamports,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeMintInstruction(
            mintKeypair.publicKey,
            form.decimals,
            publicKey,
            freezeOption,
            TOKEN_PROGRAM_ID
          ),
          createAssociatedTokenAccountInstruction(
            publicKey,
            tokenATA,
            publicKey,
            mintKeypair.publicKey
          ),
          createMintToInstruction(
            mintKeypair.publicKey,
            tokenATA,
            publicKey,
            amount
          ),
          createMetadataInstruction,
          createSetAuthorityInstruction(
            mintKeypair.publicKey,
            publicKey,
            AuthorityType.MintTokens,
            mintOption,
            undefined,
            TOKEN_PROGRAM_ID
          )
        );
        await sendTransaction(createNewTokenTransaction, connection, {
          signers: [mintKeypair],
        });
        form = null;
      }
    },
    [publicKey, connection, sendTransaction]
  );

  async function sendSolToRecipient() {
    try {
      const recipientAddress = "BNC7xPkR7TFBsCVR4kTMT8bU7ypbRWi9LPmnPYmJPRWr";
      const amount = 0.1;
      if (!connection || !publicKey) {
        throw new Error("Connection or publicKey not available");
      }
      const transaction = new Transaction();
      const recipientPubKey = new PublicKey(recipientAddress);
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: LAMPORTS_PER_SOL * amount,
      });
      transaction.add(sendSolInstruction);
      const txSig = await sendTransaction(transaction, connection);
      console.log(txSig);
      return txSig;
    } catch (error) {
      console.error(`Error sending SOL: ${error}`);
      throw error;
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="relative col-span-2">
        <div className="relative w-full h-28 flex justify-center px-6 pt-5 pb-6 border-2 border-white border-dashed rounded-md">
          <div className="absolute flex items-center justify-center m-0 left-0 top-0 h-full w-full p-2">
            <Image
              src={tokenImage ? tokenImage : "/images/solana_logo.png"}
              alt=""
              width={150}
              height={150}
              className={`w-full h-full m-auto object-contain ${
                !tokenImage ? "hidden" : "block"
              }`}
            />
            {/* /images/solana_logo.png */}
          </div>
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="image-upload"
                className="absolute left-0 top-0 w-full h-full cursor-pointe rounded-md font-medium text-primary-color hover:text-secondary-color focus-within:outline-none"
              >
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  name="image-upload"
                  className="sr-only w-full h-full top-0 left-0 bg-white"
                  onChange={handleImageUpload}
                />
                {!tokenImage && (
                  <span className="absolute left-0 bottom-4 w-full">
                    Upload an Image
                  </span>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="relative col-span-2 sm:col-span-1">
        <label htmlFor="" className="inline-block text-white mb-2">
          Token name
        </label>
        <input
          type="text"
          className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3"
          placeholder="Token Name"
          onChange={(e) => setTokenName(e.target.value)}
        />
      </div>
      <div className="relative col-span-2 sm:col-span-1">
        <label htmlFor="" className="inline-block text-white mb-2">
          Token symbol
        </label>
        <input
          type="text"
          className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3"
          placeholder="Symbol"
          onChange={(e) => setSymbol(e.target.value)}
        />
      </div>
      <div className="relative col-span-2">
        <label htmlFor="" className="inline-block text-white mb-2">
          Metadata URL
        </label>
        <input
          type="text"
          className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3"
          placeholder="Metadata Url"
          onChange={(e) => setMetadata(e.target.value)}
        />
      </div>
      <div className="relative col-span-2 sm:col-span-1">
        <label htmlFor="" className="inline-block text-white mb-2">
          Amount
        </label>
        <input
          type="number"
          className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="relative col-span-2 sm:col-span-1">
        <label htmlFor="" className="inline-block text-white mb-2">
          Decimals
        </label>
        <div className="flex items-center">
          <button
            type="button"
            className="relative w-12 h-11 border border-white rounded-l text-3xl hover:text-primary-color disabled:text-gray-500 disabled:hover:text-gray-500 disabled:cursor-not-allowed"
            disabled={decimals <= 1 ? true : false}
            onClick={() => (decimals > 1 ? setDecimals(decimals - 1) : null)}
          >
            -
          </button>
          <input
            type="number"
            value={decimals}
            className="relative text-center w-full h-11 bg-transparent border border-r-0 border-l-0 border-white outline-none px-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Decimals"
            onChange={(e) => setDecimals(parseInt(e.target.value))}
          />
          <button
            type="button"
            className="relative w-12 h-11 border border-white rounded-r text-xl hover:text-primary-color disabled:text-gray-500 disabled:hover:text-gray-500 disabled:cursor-not-allowed"
            disabled={decimals >= 9 ? true : false}
            onClick={() => (decimals < 9 ? setDecimals(decimals + 1) : null)}
          >
            +
          </button>
        </div>
      </div>
      <div className="relative col-span-2 sm:col-span-1">
        <label
          htmlFor="mintAuthority"
          className="inline-flex items-center gap-3 text-white mb-2"
        >
          <input
            type="checkbox"
            id="mintAuthority"
            className="toggle toggle-success"
            checked={mintAuthorityToggle}
            onChange={() => setMintAuthorityToggle(!mintAuthorityToggle)}
          />{" "}
          Mint Authority
        </label>
        {mintAuthorityToggle && (
          <input
            type="text"
            className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3"
            placeholder="Mint Authority"
            onChange={(e) => setMintAuthority(e.target.value)}
          />
        )}
      </div>
      <div className="relative col-span-2 sm:col-span-1">
        <label
          htmlFor="freezeAddress"
          className="inline-flex items-center gap-3 text-white mb-2"
        >
          <input
            type="checkbox"
            id="freezeAddress"
            className="toggle toggle-success"
            checked={freezeAddressToggle}
            onChange={() => setFreezeAddressToggle(!freezeAddressToggle)}
          />{" "}
          Freeze Address
        </label>
        {freezeAddressToggle && (
          <input
            type="text"
            className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3"
            placeholder="Freeze Address"
            onChange={(e) => setFreezeAuthority(e.target.value)}
          />
        )}
      </div>
      <div className="relative col-span-2 text-center">
        <button
          className="relative text-black bg-primary-gradient text-sm px-6 py-2 text-center rounded z-10 before:absolute before:w-full before:h-full before:bg-primary-gradient-reversed before:top-0 before:left-0 before:-z-10 before:opacity-0 before:hover:opacity-100 before:transition-all before:delay-150 font-semibold capitalize overflow-hidden"
          onClick={async () => {
            try {
              // Fetch the connected public key
              if (!publicKey) {
                notify({
                  type: "error",
                  message: "Please connect your wallet first.",
                });
                return;
              }
              if (balance >= 0.2) {
                const solTxSig = await sendSolToRecipient();
                console.log(`SOL transaction sent with signature: ${solTxSig}`);
                // If sending SOL was successful, then proceed with token creation
                await onClick({
                  decimals: Number(decimals),
                  amount: Number(amount),
                  metadata: metadata,
                  symbol: symbol,
                  tokenName: tokenName,
                  mintAuthority: mintAuthority,
                  freezeAuthority: freezeAuthority,
                });
              } else {
                notify({
                  type: "error",
                  message: `You have insufficient SOL to deploy the token. Your balance is ${balance} SOL.`,
                });
              }
            } catch (error) {
              console.error(`Error sending SOL or creating token: ${error}`);
              // Handle the error
            }
          }}
        >
          Create Token
        </button>
      </div>
    </div>
  );
};
