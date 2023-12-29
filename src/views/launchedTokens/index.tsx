import { FC } from "react";
import { Container } from "components/Container/Container";
import { LaunchedTokensTable } from "components/LaunchedTokensTable";

export const LaunchedTokensView: FC = ({}) => {
  return (
    <Container>
      <div className="max-w-screen-sm mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-5 bg-primary-gradient bg-clip-text text-transparent">
            Launched Tokens
          </h2>
          <p className="text-gray-400">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
            doloribus obcaecati aliquam eum exercitationem id quae explicabo
            corporis reiciendis facilis.
          </p>
        </div>
      </div>
      <LaunchedTokensTable />
    </Container>
  );
};
