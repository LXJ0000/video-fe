import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { gradientBg } from '../../theme/themeConfig';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;

  &.visible {
    opacity: 1;
    visibility: visible;
  }
`;

const Content = styled.div`
  background: ${props => props.theme.token.colorBgContainer};
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  transform: translateY(20px);
  transition: all 0.3s;
  
  .visible & {
    transform: translateY(0);
  }
`;

const Title = styled.h2`
  margin: 0 0 20px;
  font-size: 24px;
  font-weight: 600;
  background: ${gradientBg.light};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode | null;
  showDefaultFooter?: boolean;
}

export const Modal: React.FC<Props> = ({
  visible,
  title,
  onClose,
  children,
  footer,
  showDefaultFooter = true,
}) => (
  <Overlay className={visible ? 'visible' : ''} onClick={onClose}>
    <Content onClick={e => e.stopPropagation()}>
      <Title>{title}</Title>
      {children}
      {footer !== null && showDefaultFooter && (
        footer || (
          <Actions>
            <Button onClick={onClose}>取消</Button>
            <Button variant="primary">确定</Button>
          </Actions>
        )
      )}
    </Content>
  </Overlay>
); 