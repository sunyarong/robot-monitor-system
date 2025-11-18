import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { updateRobotState, addAlarm } from '../store/robotSlice';
import './ControlButtons.css';

const ControlButtons: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { robotState } = useSelector((state: RootState) => state.robot);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);

  // 模拟操作加载状态
  const simulateOperation = (operation: string, callback: () => void) => {
    setLoadingButton(operation);
    setTimeout(() => {
      callback();
      setLoadingButton(null);
    }, 1500);
  };

  // 触发自动回充
  const handleCharge = () => {
    simulateOperation('charge', () => {
      dispatch(updateRobotState({ 
        mode: 'charging',
        battery: Math.min(100, robotState.battery + 20)
      }));
      dispatch(addAlarm({
        level: 'warning',
        message: '已触发自动回充，机器人正在返回充电区',
        handled: true
      }));
    });
  };

  // 暂停巡检
  const handlePause = () => {
    dispatch(updateRobotState({ mode: 'paused' }));
    dispatch(addAlarm({
      level: 'warning',
      message: '巡检任务已暂停',
      handled: false
    }));
  };

  // 继续巡检
  const handleResume = () => {
    dispatch(updateRobotState({ mode: 'inspecting' }));
    dispatch(addAlarm({
      level: 'warning', 
      message: '巡检任务已继续',
      handled: true
    }));
  };

  // 紧急停止
  const handleEmergencyStop = () => {
    simulateOperation('emergency', () => {
      dispatch(updateRobotState({ 
        mode: 'emergency',
        task: { ...robotState.task, progress: 0 }
      }));
      dispatch(addAlarm({
        level: 'emergency',
        message: '紧急停止已触发！所有任务已暂停',
        handled: false
      }));
    });
  };

  // 重启机器人
  const handleReboot = () => {
    simulateOperation('reboot', () => {
      dispatch(updateRobotState({ 
        mode: 'inspecting',
        battery: Math.max(10, robotState.battery - 5),
        task: { ...robotState.task, progress: 0 }
      }));
      dispatch(addAlarm({
        level: 'warning',
        message: '系统重启完成，开始新的巡检任务',
        handled: true
      }));
    });
  };

  // 检查按钮是否应该禁用
  const isButtonDisabled = (buttonType: string) => {
    if (loadingButton) return true;
    
    switch (buttonType) {
      case 'charge':
        return robotState.mode === 'charging' || robotState.mode === 'paused' || robotState.mode === 'emergency' || robotState.battery >= 90;
      case 'pause':
        return robotState.mode === 'paused' || robotState.mode === 'emergency' || robotState.mode === 'charging';
      case 'resume':
        return robotState.mode === 'inspecting' || robotState.mode === 'charging' || robotState.mode === 'emergency';
      case 'emergency':
        return robotState.mode === 'emergency';
      case 'reboot':
        return robotState.mode !== 'emergency';
      default:
        return false;
    }
  };

  return (
    <div className="control-buttons tech-card">
      <div className="control-header">
        <h3>🎮 机器人控制</h3>
        <div className="current-mode">
          当前模式: <span className={`mode-tag ${robotState.mode}`}>
            {robotState.mode === 'inspecting' && '巡检中'}
            {robotState.mode === 'charging' && '充电中'}
            {robotState.mode === 'paused' && '已暂停'}
            {robotState.mode === 'emergency' && '紧急停止'}
          </span>
        </div>
      </div>

      <div className="button-grid">
        <button 
          className={`control-btn charge ${loadingButton === 'charge' ? 'loading' : ''}`}
          onClick={handleCharge}
          disabled={isButtonDisabled('charge')}
        >
          {loadingButton === 'charge' ? (
            <>
              <div className="loading-spinner"></div>
              充电中...
            </>
          ) : (
            <>
              <span className="btn-icon">🔋</span>
              自动回充
              <span className="btn-subtext">电量 {robotState.battery}%</span>
            </>
          )}
        </button>

        <button 
          className={`control-btn pause ${loadingButton === 'pause' ? 'loading' : ''}`}
          onClick={handlePause}
          disabled={isButtonDisabled('pause')}
        >
          <span className="btn-icon">⏸️</span>
          暂停巡检
          <span className="btn-subtext">暂停任务</span>
        </button>

        <button 
          className="control-btn resume"
          onClick={handleResume}
          disabled={isButtonDisabled('resume')}
        >
          <span className="btn-icon">▶️</span>
          继续巡检
          <span className="btn-subtext">恢复任务</span>
        </button>

        <button 
          className={`control-btn emergency ${loadingButton === 'emergency' ? 'loading' : ''}`}
          onClick={handleEmergencyStop}
          disabled={isButtonDisabled('emergency')}
        >
          {loadingButton === 'emergency' ? (
            <>
              <div className="loading-spinner"></div>
              停止中...
            </>
          ) : (
            <>
              <span className="btn-icon">🛑</span>
              紧急停止
              <span className="btn-subtext">立即停止</span>
            </>
          )}
        </button>

        <button 
          className={`control-btn reboot ${loadingButton === 'reboot' ? 'loading' : ''}`}
          onClick={handleReboot}
          disabled={isButtonDisabled('reboot')}
        >
          {loadingButton === 'reboot' ? (
            <>
              <div className="loading-spinner"></div>
              重启中...
            </>
          ) : (
            <>
              <span className="btn-icon">🔄</span>
              系统重启
              <span className="btn-subtext">恢复初始</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlButtons;