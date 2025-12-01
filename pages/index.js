import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import News from "../components/News";
import Footer from "../components/Footer";
import Head from "next/head";
import { useState } from "react";
import Script from "next/script";
import Posters from "../components/Updates";
import About from "../components/About";
import ChairmanMessage from "../components/ChairmanMessage";
import RectorMessage from "../components/RectorMessage";
import MileStone from "../components/MileStone";
import Logos from "../components/Logos";
import Features from "../components/Features";
import Hero from "../components/HeroBanner";
import Mission from "../components/Mission";

export default function Home() {
  const [poster, setPoster] = useState([]);
  const getPoster = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/poster`, {});
      const { data } = await res.json();
      setPoster(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPoster();
  }, []);

  useEffect(() => {
    import("aos").then((aos) => {
      aos.init({
        /* your configuration options */
      });
    });
  }, []);

  return (
    <div className="scroll-smooth">
      <Script
        src="https://unpkg.com/aos@next/dist/aos.js"
        strategy="beforeInteractive"
      />

      <Head>
        <title>Jamia Madeenathunnoor</title>
        <meta
          name="description"
          content="Jamia Madeenathunnoor epitomizes excellence, blending traditional Islamic studies with diverse aca- demic disciplines. Its multicultural environment fosters vibrant discourse, while its serene campus promotes holistic growth. Emphasizing moral values and well-being, the Jamia cultivates leaders who embody intellect, integrity, and compassion. With dedicated faculties, Jamia Madeenathunnoor stands as a beacon of enlightenment, shaping future gener- ations poised to make meaningful contributions to society."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
      </Head>

      <Navbar />

      <div className="home">
        {/* <<<<<<<<<<<  HERO >>>>>>>>> */}
        <Hero />

        <Posters poster={poster} />

        <About />
        {/* <<<<<<<<<< STATUS >>>>>>>>> */}

        <MileStone />
        <Logos />

        {/* <<<<<<<<<<< Chairman message>>>>>>>>>>>>>> */}

        <ChairmanMessage />

        {/* <<<<<< HOME ADMISSION >>>>>>>>>> */}

        <Mission />
        {/* <<<<<<<<<<< Rector message>>>>>>>>>>>>>> */}
        <RectorMessage />

        {/* <<<<<<<<<<<  FEATURES >>>>>>>>> */}
        <Features />

        {/* <<<<< NEWS >>>>>>>>> */}
        <News />
      </div>
      <Footer />
    </div>
  );
}
