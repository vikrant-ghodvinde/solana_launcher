// Next, React
import { FC, useEffect, useState } from "react";
import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";
import { CreateAccountError } from "../../components/CreateAccountError";
import pkg from "../../../package.json";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import { CreateToken } from "components/CreateToken";
import { UpdateMetadata } from "components/UpdateMetadata";
import { Container } from "components/Container/Container";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <Container>
      <div className="max-w-screen-sm mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-5 bg-primary-gradient bg-clip-text text-transparent">
            Create Solana Fungible Token
          </h2>
          <p className="text-gray-400">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
            doloribus obcaecati aliquam eum exercitationem id quae explicabo
            corporis reiciendis facilis.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative col-span-2 text-center">
            {/* <RequestAirdrop /> */}
            {wallet && (
              <div className="mt-2 text-sm text-primary-color">
                SOL Balance: {(balance || 0).toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <CreateToken />
      </div>
    </Container>
  );
};
