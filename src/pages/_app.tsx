import { AppProps } from "next/app";
import { FC } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ContextProvider>
      <Notifications />
      <AppBar />
        <Component {...pageProps} />
      <Footer />
    </ContextProvider>
  );
};

export default App;
