import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendUp, TrendDown, ChartLine, Calendar } from 'phosphor-react';
import { getPriceStats, filterHistoryByRange, formatDate, formatDateLong } from '../services/priceHistory';
import { fetchPriceHistory } from '../services/firestoreHistory';

const PriceHistoryChart = ({ cardId, currentPrice, cardName }) => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedRange, setSelectedRange] = useState('30d');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const ranges = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '1M' },
    { value: '90d', label: '3M' },
    { value: '180d', label: '6M' },
    { value: '1y', label: '1Y' },
    { value: 'all', label: 'All' }
  ];

  useEffect(() => {
    // Fetch price history from Firestore
    const loadHistory = async () => {
      setLoading(true);
      try {
        const realHistory = await fetchPriceHistory(cardId);
        
        if (realHistory.length === 0) {
          // If no history exists, seed with the current price for today
          const todayStr = new Date().toISOString().split('T')[0];
          setHistory([{
            date: todayStr,
            price: currentPrice,
            timestamp: Date.now()
          }]);
        } else {
          // Append today's real-time price as the latest point if it isn't snapshotted yet
          const todayStr = new Date().toISOString().split('T')[0];
          const hasToday = realHistory.some(h => h.date === todayStr);
          if (!hasToday) {
            setHistory([...realHistory, {
              date: todayStr,
              price: currentPrice,
              timestamp: Date.now()
            }]);
          } else {
            setHistory(realHistory);
          }
        }
      } catch (error) {
        console.error("Error loading price history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [cardId, currentPrice]);

  useEffect(() => {
    let filtered = filterHistoryByRange(history, selectedRange);
    
    // Premium UI Trick: If there is only 1 point, duplicate it 24 hours earlier
    // to render a clean horizontal baseline chart instead of a blank page.
    if (filtered.length === 1) {
      const singlePoint = filtered[0];
      const prevDate = new Date(singlePoint.timestamp - 24 * 60 * 60 * 1000);
      const prevDateStr = prevDate.toISOString().split('T')[0];
      filtered = [
        {
          date: prevDateStr,
          price: singlePoint.price,
          timestamp: prevDate.getTime()
        },
        singlePoint
      ];
    }
    
    setFilteredHistory(filtered);
    setStats(getPriceStats(filtered));
  }, [selectedRange, history]);

  // Custom tooltip
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
            ${data.price.toFixed(2)}
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
        <p style={{ color: 'var(--text-secondary)' }}>Loading price history...</p>
      </div>
    );
  }

  const isPositive = stats && stats.changePercent >= 0;

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
          <h3 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Price History</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Historical market data for {cardName}
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{
            padding: '16px',
            background: 'var(--bg-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-warm)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}>
              Change
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)'
            }}>
              {isPositive ? <TrendUp weight="bold" size={20} /> : <TrendDown weight="bold" size={20} />}
              {isPositive ? '+' : ''}{stats.changePercent}%
            </div>
          </div>

          <div style={{
            padding: '16px',
            background: 'var(--bg-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-warm)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}>
              Low
            </div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}>
              ${stats.min.toFixed(2)}
            </div>
          </div>

          <div style={{
            padding: '16px',
            background: 'var(--bg-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-warm)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}>
              High
            </div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}>
              ${stats.max.toFixed(2)}
            </div>
          </div>

          <div style={{
            padding: '16px',
            background: 'var(--bg-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-warm)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}>
              Average
            </div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}>
              ${stats.average.toFixed(2)}
            </div>
          </div>
        </div>
      )}

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
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={filteredHistory}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-terracotta)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-terracotta)" stopOpacity={0}/>
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
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="var(--accent-terracotta)"
              strokeWidth={2.5}
              fill="url(#colorPrice)"
              dot={false}
              activeDot={{
                r: 6,
                fill: 'var(--accent-terracotta)',
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
          background: 'var(--accent-terracotta)',
          borderRadius: '50%'
        }} />
        Price data updates every 24 hours • Showing {filteredHistory.length} data points
      </div>
    </div>
  );
};

export default PriceHistoryChart;
