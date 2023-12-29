import type { NextPage } from "next";
import { HomeView } from "../views";
import React from "react";
import { PageMetadata } from "components/PageMetadata/PageMetadata";

const Home: NextPage = (props) => {
  const title = "This is Page Title";
  const description = "This is Page Description"
  return (
    <React.Fragment>
      <PageMetadata title={title} description={description} />
      <HomeView />
    </React.Fragment>
  );
};

export default Home;
