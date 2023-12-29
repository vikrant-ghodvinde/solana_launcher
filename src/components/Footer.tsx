import { FC } from "react";

export const Footer: FC = () => {
  return (
    <div className="relative bottom-0 bg-black border-t border-gray-800 py-5 px-4 w-full">
      <div className="relative max-w-screen-xl mx-auto">
        <p className="text-center">
          &copy;2024, SolanaLauncher. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};
