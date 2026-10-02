import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AccommodationPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#accommodation');
  }, [router]);

  return (
    <>
      <Head>
        <title>Accommodation | YUKTHI X'26</title>
      </Head>
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Loading Accommodation... If you are not redirected, <Link href="/#accommodation" style={{ color: '#06b6d4' }}>click here</Link>.
        </p>
      </div>
    </>
  );
}
