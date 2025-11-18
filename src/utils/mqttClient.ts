import mqtt from 'mqtt';
import type  { RobotState, SensorData } from '../types/robot';

// MQTT客户端实例
let client: mqtt.MqttClient | null = null;

// 连接MQTT服务器（模拟机器人实时推送数据）
export const connectMqtt = (
  onRobotStateUpdate: (state: Partial<RobotState>) => void,
  onSensorDataUpdate: (data: SensorData) => void
) => {
  // 模拟MQTT服务器（实际项目替换为真实地址）
  client = mqtt.connect('wss://test.mosquitto.org:8081');

  // 连接成功
  client.on('connect', () => {
    console.log('MQTT连接成功，订阅机器人数据...');
    client?.subscribe('robot/state'); // 订阅机器人状态话题
    client?.subscribe('robot/sensor'); // 订阅传感器数据话题
  });

  // 接收消息
  client.on('message', (topic, payload) => {
    const data = JSON.parse(payload.toString());
    switch (topic) {
      case 'robot/state':
        onRobotStateUpdate(data); // 触发状态更新
        break;
      case 'robot/sensor':
        onSensorDataUpdate({ ...data, updateTime: new Date().toLocaleTimeString() });
        break;
    }
  });

  // 断连重连（考点：异常处理）
  client.on('close', () => {
    console.log('MQTT断连，正在重连...');
    setTimeout(connectMqtt.bind(null, onRobotStateUpdate, onSensorDataUpdate), 3000);
  });

  // 错误处理
  client.on('error', (err) => {
    console.error('MQTT错误：', err);
    client?.end();
  });
};

// 断开MQTT连接
export const disconnectMqtt = () => {
  client?.end();
  console.log('MQTT已断开连接');
};