import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import { Container } from "components/Container/Container";

export const BasicsView: FC = ({}) => {
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
        <div className="flex flex-col gap-3 items-center justify-center">
          <SignMessage />
          <SendTransaction />
        </div>
      </div>
    </Container>
  );
};
