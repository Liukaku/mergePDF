import type { NextPage } from "next";
import Head from "next/head";
import PDFMerger from "pdf-merger-js";
import { ChangeEvent, HTMLInputTypeAttribute, useRef, useState } from "react";

const Home: NextPage = () => {
  const [mergedPdfUrl, updateUrl] = useState();
  const fileUpload = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let fileObj = [];
    let fileArray: Array<string> = [];
    if (fileUpload.current) {
      fileObj.push(fileUpload.current.files);
      if (fileObj[0] !== null) {
        for (let i = 0; i < fileObj[0].length; i++) {
          fileArray.push(URL.createObjectURL(fileObj[0][i]));
        }
        console.log(fileArray);
      }
    }

    const render = async () => {
      const merger = new PDFMerger();
      for (const file of fileArray) {
        await merger.add(file);
      }

      console.log(merger);
      const mergedPdf = await merger.saveAsBlob();
      const url = URL.createObjectURL(mergedPdf);
      const what = await fetch(url);
      updateUrl(url);
    };
    try {
      render();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Combine PDFs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <input
        ref={fileUpload}
        type={"file"}
        multiple
        onChange={(e) => {
          handleChange(e);
        }}
      />

      {mergedPdfUrl && (
        <iframe src={`${mergedPdfUrl}`} height={`700`} width={`50%`}></iframe>
      )}
    </div>
  );
};

export default Home;
