import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { handleAlarm } from '../store/robotSlice';
import type { Alarm } from '../types/robot';
import './AlarmList.css';

const AlarmList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { alarms } = useSelector((state: RootState) => state.robot);

  const handleAlarmClick = (id: string) => {
    dispatch(handleAlarm(id));
  };

  // 获取告警级别对应的图标和颜色
  const getAlarmConfig = (level: Alarm['level']) => {
    switch (level) {
      case 'emergency':
        return { icon: '🚨', color: 'var(--error-color)', label: '紧急' };
      case 'warning':
        return { icon: '⚠️', color: 'var(--warning-color)', label: '警告' };
  
      default:
        return { icon: '💡', color: 'var(--primary-color)', label: '提示' };
    }
  };

  // 获取未处理告警数量
  const unhandledCount = alarms.filter(a => !a.handled).length;

  return (
    <div className="alarm-list tech-card">
      <div className="alarm-header">
        <div className="header-title">
          <span className="alarm-icon">📢</span>
          <h3>系统告警</h3>
          {unhandledCount > 0 && (
            <div className="unhandled-badge">
              {unhandledCount}
            </div>
          )}
        </div>
        <div className="header-stats">
          <span className="stats-text">
            未处理: <span className="stats-count">{unhandledCount}</span>
          </span>
        </div>
      </div>

      <div className="alarm-content">
        {alarms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-text">暂无告警信息</div>
            <div className="empty-subtext">所有系统运行正常</div>
          </div>
        ) : (
          <div className="alarm-items">
            {alarms.map(alarm => {
              const config = getAlarmConfig(alarm.level);
              return (
                <div 
                  key={alarm.id} 
                  className={`alarm-item ${alarm.handled ? 'handled' : 'unhandled'} ${alarm.level}`}
                >
                  <div className="alarm-main">
                    <div className="alarm-icon-level" style={{ color: config.color }}>
                      {config.icon}
                    </div>
                    <div className="alarm-details">
                      <div className="alarm-message">
                        {alarm.message}
                        {!alarm.handled && (
                          <span className="alarm-level-tag" style={{ backgroundColor: config.color }}>
                            {config.label}
                          </span>
                        )}
                      </div>
                      <div className="alarm-meta">
                        <span className="alarm-time">⏰ {alarm.time}</span>
                        {alarm.sensor && (
                          <span className="alarm-sensor">📡 {alarm.sensor}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    className={`handle-button ${alarm.handled ? 'handled' : ''}`}
                    onClick={() => handleAlarmClick(alarm.id)}
                    disabled={alarm.handled}
                  >
                    {alarm.handled ? (
                      <>
                        <span className="button-icon">✅</span>
                        已处理
                      </>
                    ) : (
                      <>
                        <span className="button-icon">🔧</span>
                        立即处理
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 实时告警动画指示器 */}
      {unhandledCount > 0 && (
        <div className="alarm-indicator">
          <div className="pulse-dot"></div>
          <div className="pulse-ring"></div>
          <span>有新的告警需要处理</span>
        </div>
      )}
    </div>
  );
};

export default AlarmList;