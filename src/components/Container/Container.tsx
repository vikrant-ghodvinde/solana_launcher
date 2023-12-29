import { FC } from "react";

export const Container: FC = ({ children }) => {
  return <div className="max-w-screen-xl mx-auto py-12 px-4">{children}</div>;
};
