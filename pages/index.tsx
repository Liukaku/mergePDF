import type { NextPage } from "next";
import Head from "next/head";
import PDFMerger from "pdf-merger-js";
import { ChangeEvent, HTMLInputTypeAttribute, useRef, useState } from "react";

const Home: NextPage = () => {
  const [mergedPdfUrl, updateUrl] = useState<string | null>(null);
  const [pdfError, updateError] = useState<string | null>(null);
  const fileUpload = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let fileObj = [];
    let fileArray: Array<string> = [];
    if (fileUpload.current) {
      fileObj.push(fileUpload.current.files);
      if (fileObj[0] !== null) {
        for (let i = 0; i < fileObj[0].length; i++) {
          if (fileObj[0][i].type === "application/pdf") {
            fileArray.push(URL.createObjectURL(fileObj[0][i]));
          } else {
            updateError("One of those was not a PDF, try again.");
            return;
          }
        }
        console.log(fileArray);
      }
    }

    const render = async () => {
      const merger = new PDFMerger();
      for (const file of fileArray) {
        await merger.add(file);
      }

      const mergedPdf = await (merger as any).saveAsBlob();
      const url = URL.createObjectURL(mergedPdf);
      const what = await fetch(url);
      updateError(null);
      updateUrl(url);
    };
    try {
      render();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-zinc-900 text-white">
      <Head>
        <title>Combine PDFs</title>
        <link rel="icon" href="/favicon.ico" />

        <meta
          name="description"
          content="A free, safe site to combine or merge multiple PDFs into one"
        />

        <meta name="keywords" content="PDF, PDfs, merge, combine" />
      </Head>
      <a
        className="absolute top-0 left-0 hover:text-cyan-200 duration-75 ease-in-out"
        href="https://github.com/Liukaku/mergePDF"
      >
        GitHub Repo
      </a>
      <h1 className="text-4xl font-black mb-10">
        Select multiple files and it will combine them into one
      </h1>

      <input
        className="mb-10"
        accept="application/pdf"
        ref={fileUpload}
        type={"file"}
        multiple
        onChange={(e) => {
          handleChange(e);
        }}
      />

      {pdfError && (
        <h1 className="text-xl font-black text-red-500">{pdfError}</h1>
      )}
      {mergedPdfUrl && (
        <div className="w-screen">
          <div className="w-10/12 mx-auto">
            <h2 className="w-full text-right">Now just 'Print to PDF'</h2>
            <iframe
              src={`${mergedPdfUrl}`}
              height={`700`}
              width={`100%`}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
