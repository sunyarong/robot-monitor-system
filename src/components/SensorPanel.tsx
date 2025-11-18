import React from 'react';
import type { SensorData } from '../types/robot';
import './SensorPanel.css'; // 引入CSS文件

interface Props { data: SensorData; }

const SensorPanel: React.FC<Props> = ({ data }) => {
  // 获取状态颜色
  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case 'temperature':
        return value > 30 ? 'status-high' : value < 15 ? 'status-low' : 'status-normal';
      case 'humidity':
        return value > 70 ? 'status-high' : value < 30 ? 'status-low' : 'status-normal';
      case 'noise':
        return value > 60 ? 'status-high' : 'status-normal';
      default:
        return 'status-normal';
    }
  };

  // 获取状态文本
  const getStatusText = (value: number, type: string) => {
    switch (type) {
      case 'temperature':
        return value > 30 ? '偏高' : value < 15 ? '偏低' : '正常';
      case 'humidity':
        return value > 70 ? '偏高' : value < 30 ? '偏低' : '正常';
      case 'noise':
        return value > 60 ? '嘈杂' : '正常';
      default:
        return '正常';
    }
  };

  return (
    <div className="sensor-panel tech-card">
      <div className="sensor-header">
        <h3>🌡️ 环境传感器数据</h3>
        <div className="update-time">更新: {data.updateTime}</div>
      </div>
      
      <div className="sensor-grid">
        <div className={`sensor-item ${getStatusColor(data.temperature, 'temperature')}`}>
          <div className="sensor-icon">🔥</div>
          <div className="sensor-info">
            <div className="sensor-value">{data.temperature}°C</div>
            <div className="sensor-label">温度</div>
            <div className="sensor-status">{getStatusText(data.temperature, 'temperature')}</div>
          </div>
        </div>

        <div className={`sensor-item ${getStatusColor(data.humidity, 'humidity')}`}>
          <div className="sensor-icon">💧</div>
          <div className="sensor-info">
            <div className="sensor-value">{data.humidity}%</div>
            <div className="sensor-label">湿度</div>
            <div className="sensor-status">{getStatusText(data.humidity, 'humidity')}</div>
          </div>
        </div>

        <div className={`sensor-item ${getStatusColor(data.noise, 'noise')}`}>
          <div className="sensor-icon">📢</div>
          <div className="sensor-info">
            <div className="sensor-value">{data.noise}dB</div>
            <div className="sensor-label">噪声</div>
            <div className="sensor-status">{getStatusText(data.noise, 'noise')}</div>
          </div>
        </div>
      </div>

      {/* 实时数据波动动画 */}
      <div className="sensor-animation">
        <div className="wave"></div>
      </div>
    </div>
  );
};

export default React.memo(SensorPanel);