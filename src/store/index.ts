import { configureStore } from '@reduxjs/toolkit';
import robotReducer from './robotSlice';

export const store = configureStore({
  reducer: {
    robot: robotReducer // 必须命名为robot，和组件中useSelector对应
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false // 关闭严格检查，避免日期等类型报错
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;