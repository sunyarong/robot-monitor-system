机房巡检机器人前端监控系统
# 🤖 机房巡检机器人监控系统

> 基于 React 18 + TypeScript 构建的工业级机器人智能监控平台

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-purple)](https://vitejs.dev/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-1.9.0-purple)](https://redux-toolkit.js.org/)
[![ECharts](https://img.shields.io/badge/ECharts-5.4.3-yellow)](https://echarts.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

一个现代化的机房巡检机器人监控系统前端，提供实时数据可视化、智能告警和远程控制功能，助力工业自动化运维。

## 📸 系统预览

![机房巡检机器人监控系统](./screenshot.png)

## 🛠 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Redux Toolkit
- **可视化**: ECharts
- **构建工具**: Vite
- **样式**: CSS3 + 科技感设计

## ✨ 核心特性

### 🎯 实时监控
- **🤖 机器人状态追踪** - 实时显示电量、位置、运行模式等核心指标
- **📊 多传感器数据** - 温度、湿度、噪声等环境参数实时采集
- **🗺️ 可视化地图** - 机器人在机房内的实时位置追踪

### 📈 数据可视化
- **📊 智能图表** - 基于 ECharts 的 24 小时温度趋势分析
- **🎨 状态指示器** - 颜色编码的系统状态快速识别
- **⚡ 实时更新** - MQTT 驱动的数据实时推送

### 🚨 告警管理
- **⚠️ 三级告警体系** - 紧急、警告、提示多级别告警分类
- **✅ 智能处理** - 一键处理告警，状态实时同步
- **📝 历史追踪** - 完整的告警记录和处理日志

### 🎮 远程控制
- **🔋 安全操作** - 自动回充、暂停巡检、继续任务等核心功能
- **🔒 状态验证** - 操作前状态检查，防止冲突指令
- **💫 操作反馈** - 实时操作结果提示和状态更新

### 🛡 系统特性
- **📱 响应式设计** - 完美适配桌面端和移动端
- **🔧 TypeScript** - 完整的类型安全，提升代码质量
- **🚀 性能优化** - 组件懒加载、图表增量更新等优化策略

## 🏃 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

