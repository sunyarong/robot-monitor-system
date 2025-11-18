import React, { useMemo } from 'react';
import './TemperatureChart.css';

interface TemperatureChartProps {
  temperatureData: number[];
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ temperatureData }) => {
  // 计算统计信息
  const stats = useMemo(() => {
    if (!temperatureData.length) return null;
    
    const currentTemp = temperatureData[temperatureData.length - 1];
    const maxTemp = Math.max(...temperatureData);
    const minTemp = Math.min(...temperatureData);
    const avgTemp = Number((temperatureData.reduce((a, b) => a + b, 0) / temperatureData.length).toFixed(1));
    
    // 温度状态
    let status = '正常';
    let statusColor = '#4CAF50';
    if (currentTemp > 30) {
      status = '偏高';
      statusColor = '#FF9800';
    } else if (currentTemp > 35) {
      status = '高温';
      statusColor = '#F44336';
    } else if (currentTemp < 18) {
      status = '偏低';
      statusColor = '#2196F3';
    } else if (currentTemp < 15) {
      status = '低温';
      statusColor = '#03A9F4';
    }
    
    return { currentTemp, maxTemp, minTemp, avgTemp, status, statusColor };
  }, [temperatureData]);

  // 生成时间标签
  const timeLabels = useMemo(() => {
    const now = new Date();
    return temperatureData.map((_, index) => {
      const time = new Date(now);
      time.setHours(time.getHours() - (temperatureData.length - 1 - index));
      return time.getHours().toString().padStart(2, '0') + ':00';
    });
  }, [temperatureData]);

  // 计算图表坐标
  const chartData = useMemo(() => {
    if (!temperatureData.length) return [];
    
    const maxTemp = Math.max(...temperatureData);
    const minTemp = Math.min(...temperatureData);
    const tempRange = Math.max(maxTemp - minTemp, 5); // 确保有足够的显示范围
    
    return temperatureData.map((temp, index) => {
      const x = (index / (temperatureData.length - 1)) * 100;
      const y = 100 - ((temp - (minTemp - 2)) / (tempRange + 4)) * 100; // 留出边距
      return { x, y, temp };
    });
  }, [temperatureData]);

  if (!stats) {
    return (
      <div className="temperature-chart tech-card">
        <div className="chart-loading">加载温度数据中...</div>
      </div>
    );
  }

  return (
    <div className="temperature-chart tech-card">
      <div className="chart-header">
        <h3>🌡️ 实时温度监控</h3>
        <div className="current-temp">
          <span className="temp-value">{stats.currentTemp}°C</span>
          <span className="temp-status" style={{ color: stats.statusColor }}>
            {stats.status}
          </span>
        </div>
      </div>

      <div className="chart-container">
        <svg viewBox="0 0 100 60" className="chart-svg">
          {/* 网格背景 */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="60" fill="url(#grid)" />
          
          {/* 温度区域渐变 */}
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="50%" stopColor="#4ECDC4" />
              <stop offset="100%" stopColor="#45B7D1" />
            </linearGradient>
            
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#4ECDC4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#45B7D1" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* 温度区域 */}
          <path
            d={`
              M ${chartData[0].x} 60
              ${chartData.map(point => `L ${point.x} ${point.y}`).join(' ')}
              L ${chartData[chartData.length - 1].x} 60
              Z
            `}
            fill="url(#areaGradient)"
            className="temperature-area"
          />

          {/* 温度曲线 */}
          <path
            d={`M ${chartData.map(point => `${point.x},${point.y}`).join(' L ')}`}
            fill="none"
            stroke="url(#tempGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="temperature-line"
          />

          {/* 数据点 */}
          {chartData.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="0.8"
                fill="url(#tempGradient)"
                className="data-point"
              />
              {/* 显示当前温度点 */}
              {index === chartData.length - 1 && (
                <g className="current-point">
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill="#FF4444"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                  <text
                    x={point.x}
                    y={point.y - 3}
                    textAnchor="middle"
                    fontSize="3"
                    fill="#FF4444"
                    fontWeight="bold"
                  >
                    {point.temp}°
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* 参考线 */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,0,0,0.3)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(0,255,0,0.3)" strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>
      </div>

      {/* 时间轴 */}
      <div className="time-axis">
        {timeLabels.map((label, index) => (
          <span
            key={index}
            className={`time-label ${index === timeLabels.length - 1 ? 'current' : ''}`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="temperature-stats">
        <div className="stat-item">
          <span className="stat-label">当前</span>
          <span className="stat-value" style={{ color: stats.statusColor }}>
            {stats.currentTemp}°C
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最高</span>
          <span className="stat-value" style={{ color: '#FF6B6B' }}>
            {stats.maxTemp}°C
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最低</span>
          <span className="stat-value" style={{ color: '#4ECDC4' }}>
            {stats.minTemp}°C
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">平均</span>
          <span className="stat-value">{stats.avgTemp}°C</span>
        </div>
      </div>

      {/* 温度范围指示器 */}
      <div className="temp-range-indicator">
        <div className="range-labels">
          <span>15°C</span>
          <span>25°C</span>
          <span>35°C</span>
        </div>
        <div className="range-bar">
          <div 
            className="current-range" 
            style={{
              left: `${((stats.currentTemp - 15) / 20) * 100}%`,
              backgroundColor: stats.statusColor
            }}
          ></div>
        </div>
        <div className="range-zones">
          <div className="zone low" style={{ width: '25%' }}>低温</div>
          <div className="zone normal" style={{ width: '50%' }}>正常</div>
          <div className="zone high" style={{ width: '25%' }}>高温</div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;