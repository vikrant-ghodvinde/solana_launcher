import { FC, useState, Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { WebBundlr } from "@bundlr-network/client";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { notify } from "../utils/notifications";

const bundlers = [
  { id: 1, network: "mainnet-beta", name: "https://node1.bundlr.network" },
  { id: 2, network: "devnet", name: "https://devnet.bundlr.network" },
];

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
export const UploadMetadata: FC = ({}) => {
  const wallet = useWallet();
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [bundlr, setBundlr] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [metadataUrl, setMetadataUrl] = useState(null);

  useEffect(() => {
    if (wallet && wallet.connected) {
      async function connectProvider() {
        console.log(wallet);
        await wallet.connect();
        const provider = wallet.wallet.adapter;
        await provider.connect();
        setProvider(provider);
        console.log(provider);
      }
      connectProvider();
    }
  });

  useEffect(() => {});

  const initializeBundlr = async () => {
    // initialise a bundlr client
    let bundler;
    if (selected.name === "https://devnet.bundlr.network") {
      bundler = new WebBundlr(`${selected.name}`, "solana", provider, {
        providerUrl: "https://api.devnet.solana.com",
      });
    } else {
      bundler = new WebBundlr(
        `${selected.name}`,
        "solana",
        provider
        // { providerUrl: 'https://compatible-soft-research.solana-mainnet.quiknode.pro/5b0ca91c8201b5b36b1dbaf77dbfa7675abb37ce/' }
      );
    }
    console.log(bundler);

    try {
      // Check for valid bundlr node
      await bundler.utils.getBundlerAddress("solana");
    } catch (err) {
      notify({ type: "error", message: `${err}` });
      return;
    }
    try {
      await bundler.ready();
    } catch (err) {
      notify({ type: "error", message: `${err}` });
      return;
    } //@ts-ignore
    if (!bundler.address) {
      notify({
        type: "error",
        message: "Unexpected error: bundlr address not found",
      });
    }
    notify({
      type: "success",
      message: `Connected to ${selected.network}`,
    });
    setAddress(bundler?.address);
    setBundlr(bundler);
    console.log(bundler);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    let reader = new FileReader();
    if (file) {
      setSelectedImage(file.name);
      reader.onload = function () {
        if (reader.result) {
          setImageFile(Buffer.from(reader.result as ArrayBuffer));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleMetadataChange = (event) => {
    const file = event.target.files[0];
    let reader = new FileReader();
    if (file) {
      setSelectedFile(file.name);
      reader.onload = function () {
        if (reader.result) {
          setMetadata(Buffer.from(reader.result as ArrayBuffer));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const uploadImage = async () => {
    const price = await bundlr.utils.getPrice("solana", imageFile.length);
    let amount = bundlr.utils.unitConverter(price);
    amount = amount.toNumber();
    console.log(amount);

    const loadedBalance = await bundlr.getLoadedBalance();
    console.log(bundlr);

    console.log(loadedBalance);
    let balance = bundlr.utils.unitConverter(loadedBalance.toNumber());
    balance = balance.toNumber();
    console.log(balance);

    if (balance < amount) {
      await bundlr.fund(LAMPORTS_PER_SOL);
    }

    const imageResult = await bundlr.uploader.upload(imageFile, [
      { name: "Content-Type", value: "image/png" },
    ]);
    console.log(imageResult);

    const arweaveImageUrl = `https://arweave.net/${imageResult.data.id}?ext=png`;

    if (arweaveImageUrl) {
      setImageUrl(arweaveImageUrl);
    }
  };

  const uploadMetadata = async () => {
    const price = await bundlr.utils.getPrice("solana", metadata.length);
    let amount = bundlr.utils.unitConverter(price);
    amount = amount.toNumber();

    const loadedBalance = await bundlr.getLoadedBalance();
    let balance = bundlr.utils.unitConverter(loadedBalance.toNumber());
    balance = balance.toNumber();

    if (balance < amount) {
      await bundlr.fund(LAMPORTS_PER_SOL);
    }

    const metadataResult = await bundlr.uploader.upload(metadata, [
      { name: "Content-Type", value: "application/json" },
    ]);
    const arweaveMetadataUrl = `https://arweave.net/${metadataResult.data.id}`;

    setMetadataUrl(arweaveMetadataUrl);
  };

  return (
    <div className="bg-dark rounded-md">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-10 items-center p-10 border-b border-gray-800">
        <div className="relative col-span-3 lg:col-span-2 text-center">
          <h4 className="text-xl font-bold text-white mb-2">Bundler</h4>
          <p className="text-sm text-gray-400">
            This is the bundler you will be using to upload your files to
            Arweave.
          </p>
        </div>
        <div className="relative col-span-3 sm:col-span-2">
          {/* <Dropdown data={data} /> */}
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative mt-1 z-10">
              <Listbox.Button className="relative text-start w-full h-11 rounded bg-transparent border border-white outline-none px-3">
                <span className="block truncate">
                  {!selected ? "Select Network" : selected.name}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-dark py-1 text-base shadow-lg ring-1 ring-dark focus:outline-none sm:text-sm">
                  {bundlers.map((bundler) => (
                    <Listbox.Option
                      key={bundler.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 px-3 hover:bg-primary-color hover:text-black ${
                          active ? "text-primary-color" : "text-white"
                        }`
                      }
                      value={bundler}
                    >
                      {({ selected }) => (
                        <>
                          <span className="block truncate font-medium">
                            {bundler.network}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-color">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        <div className="relative col-span-3 sm:col-span-1 text-center sm:text-start">
          <button
            type="button"
            className="relative text-black bg-primary-gradient text-sm w-auto lg:w-full min-h-11 px-6 py-2 text-center rounded z-10 before:absolute before:w-full before:h-full before:bg-primary-gradient-reversed before:top-0 before:left-0 before:-z-10 before:opacity-0 before:hover:opacity-100 before:transition-all before:delay-150 font-semibold capitalize overflow-hidden"
            onClick={async () => await initializeBundlr()}
          >
            Create Token
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-10 items-center p-10 border-b border-gray-800">
        <div className="relative col-span-3 lg:col-span-2 text-center">
          <h4 className="text-xl font-bold text-white mb-2">Image URL</h4>
          <p className="text-sm text-gray-400">
            The Arweave URL for your stored image. Set this as the{" "}
            <code className="text-primary-color">image</code> and{" "}
            <code className="text-primary-color">uri</code> values in your
            metadata file.
          </p>
        </div>

        <div className="relative col-span-3 sm:col-span-2">
          {!imageUrl ? (
            <div className="relative max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="w-full h-full cursor-pointe rounded-md font-medium text-primary-color hover:text-secondary-color focus-within:outline-none"
                  >
                    <span>Upload an image</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      className="sr-only absolute w-full h-full top-0 left-0"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                {selectedImage && (
                  <p className="text-sm text-gray-500">{selectedImage}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="px-4 py-5 bg-black space-y-6 sm:p-6">
              <a href={imageUrl} target="_blank" rel="noreferrer">
                {imageUrl}
              </a>
            </div>
          )}
        </div>

        <div className="relative col-span-3 sm:col-span-1 text-center sm:text-start">
          {!imageUrl && (
            <button
              type="button"
              className="relative text-black bg-primary-gradient text-sm w-auto lg:w-full min-h-11 px-6 py-2 text-center rounded z-10 before:absolute before:w-full before:h-full before:bg-primary-gradient-reversed before:top-0 before:left-0 before:-z-10 before:opacity-0 before:hover:opacity-100 before:transition-all before:delay-150 font-semibold capitalize overflow-hidden"
              onClick={async () => uploadImage()}
              disabled={!bundlr}
            >
              Upload Image
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-10 items-center p-10">
        <div className="relative col-span-3 lg:col-span-2 text-center">
          <h4 className="text-xl font-bold text-white mb-2">Metadata URL</h4>
          <p className="text-sm text-gray-400">
            The Arweave URL where your metadata is saved. You will use this to
            create your token.
          </p>
        </div>

        <div className="relative col-span-3 sm:col-span-2">
          {!metadataUrl ? (
            <div className="relative max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="w-full h-full cursor-pointe rounded-md font-medium text-primary-color hover:text-secondary-color focus-within:outline-none"
                  >
                    <span>Upload an file</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      className="sr-only absolute w-full h-full top-0 left-0"
                      onChange={handleMetadataChange}
                    />
                  </label>
                </div>
                {selectedFile && (
                <p className="text-sm text-gray-500">{selectedFile}</p>
              )}
              </div>
            </div>
          ) : (
            <div className="px-4 py-5 bg-black space-y-6 sm:p-6">
              <a href={metadataUrl} target="_blank" rel="noreferrer">
                {metadataUrl}
              </a>
            </div>
          )}
        </div>
        <div className="relative col-span-3 sm:col-span-1 text-center sm:text-start">
          {!metadataUrl && (
            <button
              type="button"
              className="relative text-black bg-primary-gradient text-sm w-auto lg:w-full min-h-11 px-6 py-2 text-center rounded z-10 before:absolute before:w-full before:h-full before:bg-primary-gradient-reversed before:top-0 before:left-0 before:-z-10 before:opacity-0 before:hover:opacity-100 before:transition-all before:delay-150 font-semibold capitalize overflow-hidden"
              onClick={async () => uploadMetadata()}
              disabled={!bundlr}
            >
              Upload Metadata
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
