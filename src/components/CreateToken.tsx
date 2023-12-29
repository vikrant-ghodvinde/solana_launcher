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

export const CreateToken: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [metadata, setMetadata] = useState("");
  const [amount, setAmount] = useState("");
  const [decimals, setDecimals] = useState("");
  const [mintAuthority, setMintAuthority] = useState("");
  const [freezeAuthority, setFreezeAuthority] = useState("");
  const [mintAuthorityToggle, setMintAuthorityToggle] = useState(false);
  const [freezeAddressToggle, setFreezeAddressToggle] = useState(false);
  const wallet = useWallet();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

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
      <div className="relative col-span-2 sm:col-span-1">
        <label htmlFor="" className="block text-white mb-2">
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
        <label htmlFor="" className="block text-white mb-2">
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
        <label htmlFor="" className="block text-white mb-2">
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
        <label htmlFor="" className="block text-white mb-2">
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
        <label htmlFor="" className="block text-white mb-2">
          Decimals
        </label>
        <input
          type="number"
          step="0.01"
          className="relative w-full h-11 rounded bg-transparent border border-white outline-none px-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Decimals"
          onChange={(e) => setDecimals(e.target.value)}
        />
      </div>
      <div className="relative col-span-2 sm:col-span-1">
        <label
          htmlFor="mintAuthority"
          className="flex items-center gap-3 text-white mb-2"
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
          className="flex items-center gap-3 text-white mb-2"
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
