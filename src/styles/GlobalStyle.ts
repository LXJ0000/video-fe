import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    // 亮色模式
    --text-color: rgba(0, 0, 0, 0.88);
    --text-secondary-color: rgba(0, 0, 0, 0.45);
    --component-background: #fff;
    --border-color: #f0f0f0;
    --icon-color: rgba(0, 0, 0, 0.45);
    --primary-color: #1677ff;
  }

  // 暗色模式
  [data-theme='dark'] {
    --text-color: rgba(255, 255, 255, 0.85);
    --text-secondary-color: rgba(255, 255, 255, 0.45);
    --component-background: #141414;
    --border-color: #303030;
    --icon-color: rgba(255, 255, 255, 0.45);
    --primary-color: #1668dc;
  }
`; 