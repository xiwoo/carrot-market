import { Head, Html, Main, NextScript } from "next/document";

export default function CustomDocument() {

  console.log("_document");
  return (
    <Html lang="ko">
      <Head >
        <link 
          href={"https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"}
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}