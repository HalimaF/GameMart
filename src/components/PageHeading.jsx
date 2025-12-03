import React from 'react';
import '../pages/Home.css';

const PageHeading = ({ title, highlight, subtitle, center, align = 'center', fullGradient = false }) => {
  return (
    <div style={{ textAlign: center === undefined ? align : (center ? 'center' : 'left'), marginBottom: '48px' }}>
      <h1 className="section-title" style={{ marginBottom: subtitle ? '8px' : 0 }}>
        {fullGradient ? (
          <span className="gradient-text">{[title, highlight].filter(Boolean).join(' ')}</span>
        ) : highlight ? (
          <>
            {title} <span className="gradient-text">{highlight}</span>
          </>
        ) : (
          <span className="gradient-text">{title}</span>
        )}
      </h1>
      {subtitle ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '18px' }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};

export default PageHeading;
