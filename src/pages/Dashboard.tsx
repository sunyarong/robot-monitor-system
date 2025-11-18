import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { updateRobotState, updateSensorData } from '../store/robotSlice';
import { connectMqtt, disconnectMqtt } from '../utils/mqttClient';
import RobotStatusCard from '../components/RobotStatusCard';
import SensorPanel from '../components/SensorPanel';
import ControlButtons from '../components/ControlButtons';
import TemperatureChart from '../components/TemperatureChart';
import AlarmList from '../components/AlarmList';
import './Dashboard.css';
import MapPanel from '../components/MapPanel';
import { SensorData } from '../types/robot';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { robotState, sensorData } = useSelector((state: RootState) => state.robot);
 const [tempData, setTempData] = useState<number[]>(() => {
  // 生成更真实的初始温度数据（24小时，有波动）
  return Array.from({ length: 24 }, (_, i) => {
    const baseTemp = 22 + Math.sin(i * Math.PI / 12) * 3; // 正弦波动
    const randomVariation = (Math.random() - 0.5) * 2; // 随机波动
    return Number((baseTemp + randomVariation).toFixed(1));
  });
});
(data: SensorData) => {
  dispatch(updateSensorData(data));
  // 添加更真实的温度波动
  const lastTemp = tempData[tempData.length - 1] || 24;
  const variation = (Math.random() - 0.5) * 1.5; // 更小的波动
  const newTemp = Number(Math.max(18, Math.min(32, lastTemp + variation)).toFixed(1));
  setTempData(prev => [...prev.slice(1), newTemp]);
}
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('初始化 Dashboard...');
    
    // 连接 MQTT
    const cleanup = connectMqtt(
      (state) => {
        console.log('收到机器人状态:', state);
        dispatch(updateRobotState(state));
      },
      (data) => {
        console.log('收到传感器数据:', data);
        dispatch(updateSensorData(data));
        setTempData(prev => [...prev.slice(-23), data.temperature]);
      }
    );
    
    setIsConnected(true);

    // 模拟数据更新（如果 MQTT 没有数据）
    const timer = setInterval(() => {
      if (robotState && robotState.mode === 'inspecting') {
        dispatch(updateRobotState({
          battery: Math.max(10, robotState.battery - 0.5),
   
          task: {
            ...robotState.task,
            progress: Math.min(100, robotState.task.progress + 0.3)
          }
        }));
      }
    }, 3000);

    return () => {
      console.log('清理 Dashboard...');
      disconnectMqtt();
    
      clearInterval(timer);
      setIsConnected(false);
    };
  }, [dispatch]);

  // 加载状态
  if (!robotState || !sensorData) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <h2>系统初始化中...</h2>
        <p>正在连接机器人监控系统</p>
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'connecting'}`}></span>
          {isConnected ? 'MQTT 已连接' : 'MQTT 连接中...'}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">🏭 机房巡检机器人监控系统</h1>
        <div className="dashboard-status">
          <span className={`connection-badge ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● 实时连接' : '○ 连接断开'}
          </span>
          <span className="update-time">
            最后更新: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </header>

      <section className="dashboard-controls">
        <ControlButtons />
      </section>
    
    <section className="dashboard-map">
      <MapPanel />
    </section>

      <section className="dashboard-overview">
        <div className="dashboard-grid">
          <RobotStatusCard robotState={robotState} />
          <SensorPanel data={sensorData} />
        </div>
      </section>

      <section className="dashboard-analytics">
        <div className="dashboard-charts">
          <TemperatureChart temperatureData={tempData} />
          <AlarmList />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;