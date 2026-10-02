import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CompetitionsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#competitions');
  }, [router]);

  return (
    <>
      <Head>
        <title>Competitions | YUKTHI X'26</title>
      </Head>
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Loading Competitions... If you are not redirected, <Link href="/#competitions" style={{ color: '#ec4899' }}>click here</Link>.
        </p>
      </div>
    </>
  );
}
