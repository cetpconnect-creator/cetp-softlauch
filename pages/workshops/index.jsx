import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WorkshopsGrid } from '../../components/events/EventGrid';
import EventSearch from '../../components/events/EventSearch';
import { EVENTS_DATA } from '../../data/events';

export default function WorkshopsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkshops = useMemo(() => {
    let list = EVENTS_DATA.filter((e) => e.type === 'workshops');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.heading.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      const order = [22, 23, 2, 8, 3, 5, 24, 19, 18, 20, 21, 17];
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return Number(!a.published) - Number(!b.published);
    });
  }, [searchQuery]);

  return (
    <>
      <Head>
        <title>Workshops | YUKTHI X'26 - NIT Calicut</title>
      </Head>

      <section className="page-view active" aria-labelledby="work-title">
        <div className="section-header-box">
          <Link href="/" className="breadcrumb-home-link" title="Return to YUKTHI X'26 Home">
            <span className="breadcrumb-arrow">←</span> Home
          </Link>
          <div className="header-flex-row">
            <h1 id="work-title" className="page-main-title pp-fragment">
              WORKSHOPS
            </h1>
            <EventSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search For Workshops"
            />
          </div>
        </div>

        {filteredWorkshops.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.5)',
              padding: '3rem 0',
              fontSize: '1.1rem'
            }}
          >
            No workshops found matching your search.
          </p>
        ) : (
          <WorkshopsGrid
            workshops={filteredWorkshops}
            onSelect={(ev) => router.push(`/events/${ev.id}`)}
          />
        )}
      </section>
    </>
  );
}
