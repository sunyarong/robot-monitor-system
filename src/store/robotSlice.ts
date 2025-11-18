import { createSlice } from '@reduxjs/toolkit';
import type  { PayloadAction } from '@reduxjs/toolkit';
import type { Alarm, RobotState, SensorData } from '../types/robot';

// 关键：必须有初始状态，否则组件获取不到数据
const initialState = {
  robotState: {
    battery: 80,
    mode: 'inspecting',
    position: { x: 10, y: 20, area: '机柜1区' },
      targetPosition: { x: 40, y:50},
    hardware: {
      motor: 'normal',
      camera: { normal: true, infrared: true },
      sensor: { calibrated: true, status: 'normal' }
    },
    signal: 5,
    task: { name: '巡检任务', progress: 30, remainingTime: 400 }
  } as RobotState,
  sensorData: {
    temperature: 25,
    humidity: 50,
    noise: 40,
    updateTime: new Date().toLocaleTimeString()
  } as SensorData,
  alarms: [] as Alarm[],
  commandLog: [] as string[]
};

const robotSlice = createSlice({
  name: 'robot',
  initialState,
  reducers: {
    updateRobotState: (state, action: PayloadAction<Partial<RobotState>>) => {
      state.robotState = { ...state.robotState, ...action.payload };
    },
    updateSensorData: (state, action: PayloadAction<SensorData>) => {
      state.sensorData = action.payload;
    },
    addAlarm: (state, action: PayloadAction<Omit<Alarm, 'id' | 'time'>>) => {
      state.alarms.unshift({
        ...action.payload,
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString()
      });
    },
    handleAlarm: (state, action: PayloadAction<string>) => {
      const alarm = state.alarms.find(a => a.id === action.payload);
      if (alarm) alarm.handled = true;
    },
    logCommand: (state, action: PayloadAction<string>) => {
      state.commandLog.unshift(`[${new Date().toLocaleTimeString()}] ${action.payload}`);
    }
  }
});

export const { updateRobotState, updateSensorData, addAlarm, handleAlarm, logCommand } = robotSlice.actions;
export default robotSlice.reducer;