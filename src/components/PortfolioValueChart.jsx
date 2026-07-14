import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendUp, TrendDown, ChartLine, Calendar } from 'phosphor-react';
import { generatePortfolioHistory, getPortfolioMetrics } from '../services/portfolioAnalytics';
import { filterHistoryByRange, formatDate, formatDateLong } from '../services/priceHistory';

const PortfolioValueChart = ({ cards }) => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedRange, setSelectedRange] = useState('30d');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const ranges = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '1M' },
    { value: '90d', label: '3M' },
    { value: '180d', label: '6M' }
  ];

  useEffect(() => {
    if (cards && cards.length > 0) {
      setLoading(true);

      setTimeout(() => {
        const portfolioHistory = generatePortfolioHistory(cards, 180);
        setHistory(portfolioHistory);
        setFilteredHistory(filterHistoryByRange(portfolioHistory, selectedRange));

        const days = selectedRange === '7d' ? 7 : selectedRange === '30d' ? 30 : selectedRange === '90d' ? 90 : 180;
        const portfolioMetrics = getPortfolioMetrics(cards, days);
        setMetrics(portfolioMetrics);

        setLoading(false);
      }, 500);
    }
  }, [cards]);

  useEffect(() => {
    const filtered = filterHistoryByRange(history, selectedRange);
    setFilteredHistory(filtered);

    const days = selectedRange === '7d' ? 7 : selectedRange === '30d' ? 30 : selectedRange === '90d' ? 90 : 180;
    const portfolioMetrics = getPortfolioMetrics(cards, days);
    setMetrics(portfolioMetrics);
  }, [selectedRange, history, cards]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '4px'
          }}>
            {formatDateLong(data.date)}
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--accent-terracotta)',
            fontFamily: 'var(--font-heading)'
          }}>
            ${data.value.toFixed(2)}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{
        padding: '60px 40px',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px solid var(--border-warm)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid var(--border-warm)',
          borderTop: '3px solid var(--accent-terracotta)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Analyzing portfolio...</p>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return null;
  }

  const isPositive = metrics && metrics.totalGainPercent >= 0;

  return (
    <div className="glass-panel" style={{
      padding: '32px',
      border: '1.5px solid var(--border-warm)',
      background: 'linear-gradient(135deg, var(--bg-white) 0%, var(--bg-secondary) 100%)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <ChartLine size={24} color="var(--accent-terracotta)" weight="fill" />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Portfolio Value Over Time</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Track your collection's total market value
        </p>
      </div>

      {/* Current Value & Change */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '24px',
        marginBottom: '28px',
        padding: '24px',
        background: 'var(--bg-white)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-warm)'
      }}>
        <div>
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>
            Total Portfolio Value
          </div>
          <div style={{
            fontSize: '3rem',
            fontWeight: 500,
            color: 'var(--accent-terracotta)',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em',
            lineHeight: 1
          }}>
            ${metrics?.totalValue.toFixed(2)}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>
            Period Change
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
            borderRadius: 'var(--radius-md)',
            fontSize: '1.75rem',
            fontWeight: 600
          }}>
            {isPositive ? <TrendUp weight="bold" size={28} /> : <TrendDown weight="bold" size={28} />}
            <div>
              <div style={{ fontSize: '1.75rem' }}>
                {isPositive ? '+' : ''}{metrics?.totalGainPercent.toFixed(2)}%
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                {isPositive ? '+' : ''}${metrics?.totalGain.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Range Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px',
        padding: '4px',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--border-warm)'
      }}>
        <Calendar size={18} color="var(--text-muted)" style={{ marginLeft: '8px' }} />
        {ranges.map(range => (
          <button
            key={range.value}
            onClick={() => setSelectedRange(range.value)}
            style={{
              flex: 1,
              padding: '8px 16px',
              background: selectedRange === range.value ? 'var(--accent-terracotta)' : 'transparent',
              color: selectedRange === range.value ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.9rem',
              fontWeight: selectedRange === range.value ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
            onMouseOver={e => {
              if (selectedRange !== range.value) {
                e.currentTarget.style.background = 'var(--bg-white)';
              }
            }}
            onMouseOut={e => {
              if (selectedRange !== range.value) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        background: 'var(--bg-white)',
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-warm)'
      }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={filteredHistory}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-warm)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="var(--text-muted)"
              style={{ fontSize: '0.85rem' }}
              tickMargin={10}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              stroke="var(--text-muted)"
              style={{ fontSize: '0.85rem' }}
              tickMargin={10}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? 'var(--accent-green)' : 'var(--accent-red)'}
              strokeWidth={2.5}
              fill="url(#portfolioGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                stroke: 'white',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: '20px',
        padding: '12px 16px',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          background: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
          borderRadius: '50%'
        }} />
        Portfolio value calculated from {metrics?.totalCards} cards • Updates daily
      </div>
    </div>
  );
};

export default PortfolioValueChart;
