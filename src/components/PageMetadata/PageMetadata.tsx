import Head from "next/head";
import { FC } from "react";

interface PageMetadataProps {
  title: string;
  description: string;
}

export const PageMetadata: FC<PageMetadataProps> = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Add other meta tags as needed */}
    </Head>
  );
};
