import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel="preload" href="/static/fonts/Sono-Bold.ttf" as="font" crossOrigin="anonymous" ></link>
        <link rel="preload" href="/static/fonts/Sono-Regular.ttf" as="font" crossOrigin="anonymous" ></link>
        <link rel="preload" href="/static/fonts/Sono-SemiBold.ttf" as="font" crossOrigin="anonymous" ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}