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
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700&family=Noto+Sans+HK:wght@300&display=swap" rel="stylesheet" crossOrigin="anonymous"/>
      </Head>
      <body>
        <Main />
        <div id="portal" style={{zIndex: -1}}/>
        <NextScript />
      </body>
    </Html>
  )
}