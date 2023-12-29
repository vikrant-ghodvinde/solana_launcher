import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../views";
import { PageMetadata } from "components/PageMetadata/PageMetadata";

const Basics: NextPage = (props) => {
  const title = "This is Page Title";
  const description = "This is Page Description";
  return (
    <div>
      <PageMetadata title={title} description={description} />
      <BasicsView />
    </div>
  );
};

export default Basics;
