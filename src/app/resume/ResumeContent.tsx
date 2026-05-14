'use client';

import { useEffect, useRef, useState } from 'react';

export default function ResumeContent({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      let cols: number;

      if (width >= 1400) cols = 3;
      else if (width >= 1100) cols = 2;
      else cols = 1;

      const container = containerRef.current;
      if (container) {
        const contentHeight = container.scrollHeight;
        const viewportHeight = container.clientHeight;

        if (contentHeight > viewportHeight * cols) {
          // Content overflows even in max columns, bump up one
          setColumnCount(cols + 1);
        } else {
          setColumnCount(cols);
        }
      } else {
        setColumnCount(cols);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return (
    <div style={{ margin: '0', padding: '10px' }}>
      <div
        ref={containerRef}
        style={{
          height: 'calc(100vh - 40px)',
          overflow: 'auto',
          columnCount,
          columnGap: '20px',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          padding: '10px',
          transition: 'column-count 0.3s ease',
        }}
      >
        <div style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit',
          fontSize: '0.68em',
          lineHeight: '1.3',
          margin: 0,
          breakInside: 'avoid',
          wordBreak: 'break-word',
        }}>
          {content}
        </div>
      </div>
    </div>
  );
}
