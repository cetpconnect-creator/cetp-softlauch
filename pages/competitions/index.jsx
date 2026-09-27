import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import EventCard from '../../components/events/EventCard';
import EventModal from '../../components/events/EventModal';
import EventTabs from '../../components/events/EventTabs';
import EventSearch from '../../components/events/EventSearch';
import { EVENTS_DATA } from '../../data/events';

export default function CompetitionsPage({ onToast }) {
  const [activeTab, setActiveTab] = useState('tathva'); // 'tathva' or 'pretathva'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredCompetitions = useMemo(() => {
    let list = EVENTS_DATA.filter((e) => e.type === 'competitions');
    if (activeTab === 'pretathva') {
      list = list.filter((e) => e.committee === 'GPC');
    } else {
      list = list.filter((e) => e.committee !== 'GPC');
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.heading.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => Number(!a.published) - Number(!b.published));
  }, [activeTab, searchQuery]);

  return (
    <>
      <Head>
        <title>Competitions | YUKTHI X'26 - NIT Calicut</title>
      </Head>

      <section className="page-view active" aria-labelledby="comp-title">
        <div className="section-header-box">
          <Link href="/" className="breadcrumb-home-link" title="Return to YUKTHI X'26 Home">
            <span className="breadcrumb-arrow">←</span> Home
          </Link>
          <div className="header-flex-row">
            <h1 id="comp-title" className="page-main-title pp-fragment">
              COMPETITIONS
            </h1>
            <EventSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search For Competitions"
            />
          </div>
        </div>

        {/* YUKTHI X'26 vs Pre-Tathva Tabs */}
        <EventTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: 'tathva', label: "YUKTHI X'26" },
            { id: 'pretathva', label: 'PRE-TATHVA' }
          ]}
        />

        {/* Competitions Grid */}
        {filteredCompetitions.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.5)',
              padding: '3rem 0',
              fontSize: '1.1rem'
            }}
          >
            No competitions found matching your search.
          </p>
        ) : (
          <div className="events-grid competitions-grid">
            {filteredCompetitions.map((ev) => (
              <EventCard key={ev.id} event={ev} onSelect={setSelectedEvent} />
            ))}
          </div>
        )}

        {/* Event Details Modal Dialog */}
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onRegister={(ev) => {
              if (onToast) {
                onToast(`Registered successfully for ${ev.heading}! Confirmation sent.`);
              } else {
                alert(`Registered successfully for ${ev.heading}! Confirmation sent.`);
              }
              setSelectedEvent(null);
            }}
          />
        )}
      </section>
    </>
  );
}
