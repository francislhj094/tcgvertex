import React from 'react';

const PriceTable = ({ prices }) => {
  if (!prices || Object.keys(prices).length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', padding: '16px', textAlign: 'center' }}>
        No pricing data available for this card.
      </div>
    );
  }

  // Format variant names nicely
  const formatVariant = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('1st Edition', '1st Ed.')
      .trim();
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="price-table">
        <thead>
          <tr>
            <th>Variant</th>
            <th>Low</th>
            <th>Mid</th>
            <th>High</th>
            <th>Market</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(prices).map(([variant, data]) => (
            <tr key={variant}>
              <td className="variant-name">{formatVariant(variant)}</td>
              <td style={{ color: 'var(--text-secondary)' }}>
                {data.low ? `$${data.low.toFixed(2)}` : '—'}
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>
                {data.mid ? `$${data.mid.toFixed(2)}` : '—'}
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>
                {data.high ? `$${data.high.toFixed(2)}` : '—'}
              </td>
              <td style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>
                {data.market ? `$${data.market.toFixed(2)}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceTable;
