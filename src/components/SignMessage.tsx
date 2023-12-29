// TODO: SignMessage
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { FC, useCallback } from "react";
import { sign } from "tweetnacl";
import { notify } from "../utils/notifications";

export const SignMessage: FC = () => {
  const { publicKey, signMessage } = useWallet();

  const onClick = useCallback(async () => {
    try {
      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey) throw new Error("Wallet not connected!");
      // `signMessage` will be undefined if the wallet doesn't support it
      if (!signMessage)
        throw new Error("Wallet does not support message signing!");
      // Encode anything as bytes
      const message = new TextEncoder().encode("Hello, world!");
      // Sign the bytes using the wallet
      const signature = await signMessage(message);
      // Verify that the bytes were signed using the private key that matches the known public key
      if (!sign.detached.verify(message, signature, publicKey.toBytes()))
        throw new Error("Invalid signature!");
      notify({
        type: "success",
        message: "Sign message successful!",
        txid: bs58.encode(signature),
      });
    } catch (error: any) {
      notify({
        type: "error",
        message: `Sign Message failed!`,
        description: error?.message,
      });
      console.log("error", `Sign Message failed! ${error?.message}`);
    }
  }, [publicKey, notify, signMessage]);

  return (
    <div>
      <button
        className="relative text-black bg-primary-gradient text-sm px-6 py-2 text-center rounded z-10 before:absolute before:w-full before:h-full before:bg-primary-gradient-reversed before:top-0 before:left-0 before:-z-10 before:opacity-0 before:hover:opacity-100 before:transition-all before:delay-150 font-semibold capitalize overflow-hidden"
        onClick={onClick}
        disabled={!publicKey}
      >
        <div className="hidden group-disabled:block">Wallet not connected</div>
        <span className="block group-disabled:hidden">Sign Message</span>
      </button>
    </div>
  );
};
