import styled from 'styled-components';
import { gradientBg } from '../../theme/themeConfig';

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  background: ${props => props.variant === 'primary' ? gradientBg.light : 'transparent'};
  color: ${props => props.variant === 'primary' ? '#fff' : props.theme.token.colorText};
  
  ${props => props.variant !== 'primary' && `
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`; 