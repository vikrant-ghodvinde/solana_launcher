import type { NextPage } from "next";
import React from "react";
import { PageMetadata } from "components/PageMetadata/PageMetadata";
import Image from "next/image";

const ComingSoon: NextPage = (props) => {
  const title = "This is Page Title";
  const description = "This is Page Description";
  return (
    <React.Fragment>
      <PageMetadata title={title} description={description} />
      <div className="relative w-full h-full min-h-screen py-12 px-3 flex flex-col items-center justify-center">
        <div>
          <Image
            src="/images/solana_logo.png"
            width={96}
            height={96}
            className="w-24"
            alt="Flowbite Logo"
          />
        </div>
        <h2 className="relative text-5xl font-bold uppercase bg-primary-gradient bg-clip-text text-transparent my-8">
          Coming Soon
          <span className="relative inline-block before:animate-bounce px-2 before:content-[''] before:absolute before:bottom-0 before:w-2 before:h-2 before:bg-primary-gradient"></span>
          <span className="relative inline-block before:animate-bounce before:animate-delay-100 px-2 before:content-[''] before:absolute before:bottom-0 before:w-2 before:h-2 before:bg-primary-gradient"></span>
          <span className="relative inline-block before:animate-bounce before:animate-delay-200 px-2 before:content-[''] before:absolute before:bottom-0 before:w-2 before:h-2 before:bg-primary-gradient"></span>
        </h2>
        <div className="text-center max-w-4xl text-sm">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Consequuntur obcaecati distinctio, eveniet fuga illo illum
            aspernatur aut debitis sit laboriosam!
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ComingSoon;
