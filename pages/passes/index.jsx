import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PassesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#passes');
  }, [router]);

  return (
    <>
      <Head>
        <title>Passes | YUKTHI X'26</title>
      </Head>
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Loading Passes... If you are not redirected, <Link href="/#passes" style={{ color: '#eab308' }}>click here</Link>.
        </p>
      </div>
    </>
  );
}
