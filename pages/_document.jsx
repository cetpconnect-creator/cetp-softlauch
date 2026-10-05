import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Inter+Tight:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&family=Orbitron:wght@500;600;700;800;900&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&family=Syncopate:wght@400;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
