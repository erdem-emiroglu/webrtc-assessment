import { Html, Head, Main, NextScript } from 'next/document'

const metaDescription = 'Build a voice chat application using React, Redux, and TailwindCSS. The app allows users to create and join chat rooms, and chat with each other using WebRTC.';
const metaTitle = 'OCRLabs - Assessment';


export default function Document() {
  return (
    <Html lang="en">
      <Head>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
