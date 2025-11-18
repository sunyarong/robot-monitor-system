// 机器人位置类型
export interface RobotPosition {
  x: number; // 机房地图X坐标
  y: number; // 机房地图Y坐标
  area: string; // 当前区域（如"机柜1区"）
}

// 机器人硬件状态类型
export interface RobotHardware {
  motor: 'normal' | 'warning' | 'error'; // 电机状态
  camera: { normal: boolean; infrared: boolean }; // 相机工作状态
  sensor: { calibrated: boolean; status: 'normal' | 'error' }; // 传感器状态
}

// 机器人核心状态类型（整合所有关键信息）
export interface RobotState {
  battery: number; // 电量（0-100）
  mode: 'inspecting' | 'charging' | 'error' |'emergency' |'paused';
  position: RobotPosition;
  hardware: RobotHardware;
  signal: number; // 网络信号强度（0-5）
  task: { name: string; progress: number; remainingTime: number }; // 任务信息
}

// 传感器数据类型
export interface SensorData {
  temperature: number; // 温度（℃）
  humidity: number; // 湿度（%）
  noise: number; // 噪声（dB）
  updateTime: string; // 更新时间
}

// 告警类型
export interface Alarm {
  id: string;
  level:'emergency' | 'warning' |'info';
  message: string; // 告警信息
  time: string; // 触发时间
  handled: boolean; 
  sensor?: string;
}