import type { NextPage } from "next";

import Form from "../components/form";
import { SiteHeader } from "../components/site-header";
import { useIsMounted } from "../hooks/useIsMounted";
import Head from "next/head";

const Home: NextPage = () => {
  const mounted = useIsMounted();

  if (mounted)
    return (
      <>
        <Head>
          <title>TrueID</title>
          <meta name="description" content="" />
        </Head>

        <SiteHeader />
        <head>TrueID</head>
        <section className="container grid items-center pb-8 pt-6 md:py-10">
          <div className="flex justify-center">
            <Form />
          </div>
        </section>
      </>
    );
};

export default Home;
