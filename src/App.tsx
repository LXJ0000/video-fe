import React, { useState } from 'react';
import { ConfigProvider, Layout } from 'antd';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, gradientBg } from './theme/themeConfig';
import VideoList from './components/VideoList';
import VideoFeed from './components/VideoFeed';
import { GlobalStyle } from './styles/GlobalStyle';
import ToastContainer from './components/common/Toast';

const { Header, Content } = Layout;

const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  position: fixed;
  width: 100%;
  z-index: 1;
  background: transparent;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.token.colorBorder};
`;

const StyledContent = styled(Content)`
  margin-top: 64px;
  padding: 24px;
  min-height: calc(100vh - 64px);
  background: ${props => props.theme.token.colorBgContainer};
`;

const Logo = styled.h1`
  color: ${props => props.theme.token.colorText};
  margin: 0;
`;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: ${props => props.theme.token.colorBgContainer};
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: ${gradientBg.light};
    opacity: 0.1;
    pointer-events: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const StyledButton = styled.button`
  padding: 4px 16px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: ${props => props.theme.token.colorTextSecondary};
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  position: relative;
  
  &:hover {
    color: ${props => props.theme.token.colorPrimary};
  }
  
  &.active {
    color: ${props => props.theme.token.colorPrimary};
  }
`;

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFeed, setShowFeed] = useState(false);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <>
      <GlobalStyle />
      <ConfigProvider theme={currentTheme}>
        <ThemeProvider theme={currentTheme}>
          <StyledLayout data-theme={isDarkMode ? 'dark' : 'light'}>
            <StyledHeader>
              <Logo>视频平台</Logo>
              <ButtonGroup>
                {!showFeed && (
                  <StyledButton 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={isDarkMode ? 'active' : ''}
                  >
                    夜间模式
                  </StyledButton>
                )}
                <StyledButton 
                  onClick={() => setShowFeed(!showFeed)}
                  className={showFeed ? 'active' : ''}
                >
                  {showFeed ? '返回列表' : '视频流'}
                </StyledButton>
              </ButtonGroup>
            </StyledHeader>
            <StyledContent>
              {showFeed ? <VideoFeed /> : <VideoList />}
            </StyledContent>
          </StyledLayout>
          <ToastContainer />
        </ThemeProvider>
      </ConfigProvider>
    </>
  );
};

export default App;
