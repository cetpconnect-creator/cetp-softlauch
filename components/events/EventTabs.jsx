import React from 'react';

export default function EventTabs({ activeTab, onTabChange, tabs = [
  { id: 'tathva', label: "YUKTHI X'26" },
  { id: 'pretathva', label: 'PRE-TATHVA' }
] }) {
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeTab));
  const tabWidthPct = 100 / tabs.length;

  return (
    <div className="tabs-container">
      <div className="tabs-flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="tab-slider-bar"
        style={{
          width: `${tabWidthPct}%`,
          transform: `translateX(${activeIndex * 100}%)`
        }}
      />
    </div>
  );
}
