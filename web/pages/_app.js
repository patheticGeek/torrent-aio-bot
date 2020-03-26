import React, { useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";

import Navbar from "../components/Navbar";

import "../assets/css/index.css";
import "../assets/css/helpers.css";
import "../assets/css/navbar.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());

    return () => {
      Router.events.off("routeChangeStart", () => NProgress.start());
      Router.events.off("routeChangeComplete", () => NProgress.done());
      Router.events.off("routeChangeError", () => NProgress.done());
    };
  });

  return (
    <>
      <Head>
        <title>Torrent aio bot</title>
        <link
          href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400,600,700&display=swap"
          rel="stylesheet"
        />
        <script type="module" src="https://unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.esm.js"></script>
        <script noModule="" src="https://unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.js"></script>
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
