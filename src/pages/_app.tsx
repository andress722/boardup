
import { Header } from '../components/Header';
import {PayPalScriptProvider} from "@paypal/react-paypal-js"
import '../styles/global.scss';

import { SessionProvider } from 'next-auth/react';

const initialOptions = {
  "client-id": "AdyiVa69tMMwagFhjmrrGGNWFJN2yFoNzCdG18NBTuxcEKNxWCvSTUODXrNC01VX3d1d9l9LKqrz0z2a",
  currency: "BRL",
  intent: "capture"
}


function MyApp({ Component, pageProps: {session, token, ...pageProps}  }) {
  return (
    
    <SessionProvider session={session}>
      <PayPalScriptProvider options={initialOptions}>
      <Header/>
      <Component {...pageProps} />
      </PayPalScriptProvider>
    </SessionProvider>
  )
}

export default MyApp
