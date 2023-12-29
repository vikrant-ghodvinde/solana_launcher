import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, TransactionSignature } from "@solana/web3.js";
import { FC, useCallback } from "react";
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore";

export const RequestAirdrop: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  const onClick = useCallback(async () => {
    if (!publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }

    let signature: TransactionSignature = "";

    try {
      signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature, "confirmed");
      notify({
        type: "success",
        message: "Airdrop successful!",
        txid: signature,
      });

      getUserSOLBalance(publicKey, connection);
    } catch (error: any) {
      notify({
        type: "error",
        message: `Airdrop failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Airdrop failed! ${error?.message}`, signature);
    }
  }, [publicKey, connection, getUserSOLBalance]);

  return (
    <div>
      <button
        className="relative text-black bg-primary-gradient text-sm px-6 py-2 text-center rounded z-10 before:absolute before:w-full before:h-full before:bg-primary-gradient-reversed before:top-0 before:left-0 before:-z-10 before:opacity-0 before:hover:opacity-100 before:transition-all before:delay-150 font-semibold capitalize overflow-hidden"
        onClick={onClick}
      >
        <span>Airdrop 1 </span>
      </button>
    </div>
  );
};
