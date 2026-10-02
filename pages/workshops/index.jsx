import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function WorkshopsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#workshops');
  }, [router]);

  return (
    <>
      <Head>
        <title>Workshops | YUKTHI X'26</title>
      </Head>
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Loading Workshops... If you are not redirected, <Link href="/#workshops" style={{ color: '#22d3ee' }}>click here</Link>.
        </p>
      </div>
    </>
  );
}
