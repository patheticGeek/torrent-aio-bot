import React from "react";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";

import Navbar from "../components/Navbar";

import "../assets/css/index.css";
import "../assets/css/helpers.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Torrent aio bot</title>
          <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400,600,700&display=swap" rel="stylesheet" />
          <link href="https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css" rel="stylesheet" />
        </Head>
        <Navbar />
        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;
