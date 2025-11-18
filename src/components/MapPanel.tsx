import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { updateRobotState, addAlarm } from '../store/robotSlice';
import './MapPanel.css';

// 模拟地图数据
const MAP_DATA = {
  width: 800,
  height: 600,
  areas: [
    { id: 'server-room', name: '服务器区', type: 'server', x: 100, y: 100, width: 200, height: 150 },
    { id: 'network-room', name: '网络设备区', type: 'network', x: 350, y: 100, width: 200, height: 150 },
    { id: 'storage-room', name: '存储区', type: 'storage', x: 100, y: 300, width: 200, height: 150 },
    { id: 'power-room', name: '电力区', type: 'power', x: 350, y: 300, width: 200, height: 150 },
    { id: 'charging-station', name: '充电站', type: 'charging', x: 600, y: 400, width: 80, height: 80 }
  ],
  paths: [
    { id: 'main-corridor', points: [250, 0, 250, 600] },
    { id: 'cross-corridor', points: [0, 275, 800, 275] }
  ]
};

const MapPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { robotState } = useSelector((state: RootState) => state.robot);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  // 处理地图点击导航
  const handleMapClick = (areaId: string, areaName: string, x: number, y: number) => {
    if (robotState.mode === 'emergency') {
      dispatch(addAlarm({
        level: 'warning',
        message: '紧急停止状态下无法导航',
        handled: false
      }));
      return;
    }

    setSelectedArea(areaId);
    
    // 更新机器人目标位置
    dispatch(updateRobotState({
 
      task: {
        ...robotState.task,
        name: `导航到${areaName}`,
        progress: 0
      }
    }));

    dispatch(addAlarm({
      level: 'info',
      message: `已设置导航目标: ${areaName}`,
      handled: true
    }));

    console.log(`导航到: ${areaName} (${x}, ${y})`);
  };

  // 计算机器人在地图上的位置
  const getRobotPosition = () => {
    const scaleX = MAP_DATA.width / 50; // 假设实际场地宽50米
    const scaleY = MAP_DATA.height / 40; // 假设实际场地高40米
    return {
      x: robotState.position.x * scaleX,
      y: robotState.position.y * scaleY
    };
  };

  const robotPos = getRobotPosition();

  return (
    <div className="map-panel tech-card">
      <div className="map-header">
        <h3>🗺️ 机房地图导航</h3>
        <div className="map-controls">
          <button 
            className="control-btn"
            onClick={() => setSelectedArea(null)}
          >
            清除目标
          </button>
          <span className="map-scale">比例尺: 1:10</span>
        </div>
      </div>

      <div className="map-container">
        <svg 
          width="100%" 
          height="400" 
          viewBox={`0 0 ${MAP_DATA.width} ${MAP_DATA.height}`}
          className="map-svg"
        >
          {/* 背景 */}
          <rect width="100%" height="100%" fill="#f8f9fa" />
          
          {/* 路径 */}
          {MAP_DATA.paths.map(path => (
            <polyline
              key={path.id}
              points={path.points.join(' ')}
              stroke="#dee2e6"
              strokeWidth="8"
              fill="none"
            />
          ))}
          
          {/* 区域 */}
          {MAP_DATA.areas.map(area => (
            <g key={area.id}>
              <rect
                x={area.x}
                y={area.y}
                width={area.width}
                height={area.height}
                fill={selectedArea === area.id ? '#e3f2fd' : '#ffffff'}
                stroke={selectedArea === area.id ? '#1976d2' : '#bdbdbd'}
                strokeWidth="2"
                  data-area-type={area.type}

                className="map-area"
                onClick={() => handleMapClick(area.id, area.name, area.x + area.width/2, area.y + area.height/2)}
              />
              <text
                x={area.x + area.width/2}
                y={area.y + area.height/2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#333"
              >
                {area.name}
              </text>
            </g>
          ))}
          
          {/* 机器人位置 */}
          <circle
            cx={robotPos.x}
            cy={robotPos.y}
            r="8"
            fill="#ff4444"
            stroke="#ffffff"
            strokeWidth="2"
            className="robot-marker"
          />
          
          {/* 目标位置指示器 */}
          {selectedArea && (() => {
            const targetArea = MAP_DATA.areas.find(area => area.id === selectedArea);
            if (!targetArea) return null;
            return (
              <circle
                cx={targetArea.x + targetArea.width/2}
                cy={targetArea.y + targetArea.height/2}
                r="6"
                fill="none"
                stroke="#4caf50"
                strokeWidth="2"
                strokeDasharray="4"
                className="target-marker"
              >
                <animate
                  attributeName="r"
                  from="6"
                  to="12"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            );
          })()}
        </svg>
      </div>

      <div className="map-info">
        <div className="info-item">
          <span className="label">当前位置:</span>
          <span className="value">X: {robotState.position.x.toFixed(1)}, Y: {robotState.position.y.toFixed(1)}</span>
        </div>
        {selectedArea && (
          <div className="info-item">
            <span className="label">导航目标:</span>
            <span className="value">
              {MAP_DATA.areas.find(area => area.id === selectedArea)?.name}
            </span>
          </div>
        )}
        <div className="info-item">
          <span className="label">地图状态:</span>
          <span className="value">
            {robotState.mode === 'emergency' ? '导航锁定' : '可操作'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;