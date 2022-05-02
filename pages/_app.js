import Head from 'next/head'
import { request } from 'graphql-request'
import { SWRConfig } from 'swr'
import 'primereact/resources/themes/mdc-light-indigo/theme.css' // theme
import 'primereact/resources/primereact.min.css' // core css
import 'primeicons/primeicons.css' // icons
import '../styles/globals.css'

function MyApp ({ Component, pageProps }) {
  const fetcher = async (query, variables, token) => {
    if (!query) return null
    if (!variables) return await request(process.env.NEXT_PUBLIC_URL_BACKEND, query)
    if (!token) return await request(process.env.NEXT_PUBLIC_URL_BACKEND, query, variables)
    return await request(process.env.NEXT_PUBLIC_URL_BACKEND, query, variables, { authorization: `Bearer ${token}` })
  }
  return (
    <>
      <Head>
        <title>Plantilla CNE</title>
        <link rel="icon" href="https://intranet.cne.gob.ve/files/favicon.ico"/>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        <meta name="description" content="Plantilla para crear aplicaciones web para el CNE"/>
        <meta name="theme-color" content="#000000"/>
      </Head>
      <SWRConfig value={{ fetcher, revalidateOnFocus: process.env.NEXT_PUBLIC_PRODUCTION === 'true' }}>
        <Component {...pageProps} />
      </SWRConfig>
    </>
  )
}

export default MyApp
