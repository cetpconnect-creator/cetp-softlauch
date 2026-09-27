import React from 'react';

export default function EventSearch({ value, onChange, placeholder = "Search For Events" }) {
  return (
    <div className="search-input-wrapper">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  );
}
