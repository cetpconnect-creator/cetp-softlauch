import React from 'react';
import Head from 'next/head';
import Hero from '../components/home/Hero';
import About from '../components/home/About';

export default function HomePage({ onToast }) {
  return (
    <>
      <Head>
        <title>YUKTHI X'26 | National Techno-Management Fest</title>
      </Head>
      <div className="home-page-view">
        <Hero />
        <About />
      </div>
    </>
  );
}
