import { Html, Head, Main, NextScript } from 'next/document'
import metadata from '@consts/metadata.json'

export default function Document() {
  return (
    <Html>
      <Head>
        {Object.entries(metadata.document).map(([type, content]) => 
          <meta key={type} name={type} content={content}/>)}
        {Object.entries(metadata.link).map(([type, href]) => 
          <link key={type} rel={type} href={href}/>)}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700&family=Noto+Sans+HK:wght@300&display=swap" rel="stylesheet"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}