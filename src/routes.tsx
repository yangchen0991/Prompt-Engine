import CanvasPage from './pages/CanvasPage';
import PromptTunerPage from './pages/PromptTunerPage';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  /** Accessible without login. Routes without this flag require authentication. Has no effect when RouteGuard is not in use. */
  public?: boolean;
}

export const routes: RouteConfig[] = [
  {
    name: '绘词引擎',
    path: '/',
    element: <CanvasPage />,
    public: true,
  },
  {
    name: '专业提示词调优器',
    path: '/tuner',
    element: <PromptTunerPage />,
    public: true,
    visible: true,
  },
];
