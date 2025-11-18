import React from 'react';
import styled from 'styled-components';
import type { RobotState } from '../types/robot';

// 样式组件（避免样式冲突，动态样式）
const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
const StatusTag = styled.span<{ type: 'normal' | 'warning' | 'error' }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
  color: white;
  background: ${p => p.type === 'normal' ? 'green' : p.type === 'warning' ? 'orange' : 'red'};
`;

// Props类型定义（严格约束）
interface Props { robotState: RobotState; }

const RobotStatusCard: React.FC<Props> = ({ robotState }) => {
  // 模式转中文
  const getModeText = () => {
    switch (robotState.mode) {
      case 'inspecting': return '巡检中';
      case 'charging': return '充电中';
      case 'error': return '故障';
    }
  };

  return (
    <Card>
      <h3>机器人状态总览</h3>
      <p>运行模式：<StatusTag type={robotState.mode === 'error' ? 'error' : 'normal'}>{getModeText()}</StatusTag></p>
      <p>电池电量：{robotState.battery}%（{robotState.battery < 30 ? <span style={{ color: 'red' }}>需回充</span> : '正常'}）</p>
      <p>当前区域：{robotState.position.area}（X:{robotState.position.x}, Y:{robotState.position.y}）</p>
      <p>电机状态：<StatusTag type={robotState.hardware.motor}>{robotState.hardware.motor}</StatusTag></p>
      <p>网络信号：{Array(robotState.signal).fill('📶').join('')}</p>
      <p>当前任务：{robotState.task.name}（进度：{robotState.task.progress}%，剩余{robotState.task.remainingTime}秒）</p>
    </Card>
  );
};

export default React.memo(RobotStatusCard); // 性能优化：缓存组件（考点：性能优化）