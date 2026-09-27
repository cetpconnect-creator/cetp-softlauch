import React from 'react';
import Link from 'next/link';

export default function SectionTitle({
  title,
  tag,
  description,
  backLink = false,
  backHref = '/',
  backLabel = 'Home',
  className = '',
  center = false
}) {
  return (
    <div className={`section-header-box ${center ? 'text-center' : ''} ${className}`}>
      {backLink && (
        <Link href={backHref} className="breadcrumb-home-link" title={`Return to ${backLabel}`}>
          <span className="breadcrumb-arrow">←</span> {backLabel}
        </Link>
      )}
      {tag && <p className="section-tag-pill">{tag}</p>}
      <h1 className="page-main-title pp-fragment">{title}</h1>
      {description && <p className="section-description-text">{description}</p>}
    </div>
  );
}
