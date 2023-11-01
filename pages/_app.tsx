import type { AppProps } from "next/app";
import Nav from "@components/Nav";
import { SessionProvider } from "next-auth/react";
import RootLayout from "@app/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <RootLayout>
        <Nav></Nav>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
}

export default MyApp;
