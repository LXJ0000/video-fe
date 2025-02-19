import React from 'react';
import styled from 'styled-components';

interface IconProps {
  onClick?: () => void;
}

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);

  &:hover {
    transform: scale(1.1);
    background: ${props => props.theme.token.colorPrimary};
    
    svg {
      fill: white;
    }
  }

  svg {
    width: 20px;
    height: 20px;
    fill: ${props => props.theme.token.colorText};
    transition: fill 0.3s;
  }
`;

export const EditIcon: React.FC<IconProps> = ({ onClick }) => (
  <IconWrapper onClick={onClick}>
    <svg viewBox="0 0 24 24">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  </IconWrapper>
);

export const DeleteIcon: React.FC<IconProps> = ({ onClick }) => (
  <IconWrapper onClick={onClick}>
    <svg viewBox="0 0 24 24">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  </IconWrapper>
);

export const PlayIcon: React.FC<IconProps> = ({ onClick }) => (
  <IconWrapper onClick={onClick}>
    <svg viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  </IconWrapper>
);

export const ClockIcon: React.FC<IconProps> = ({ onClick }) => (
  <IconWrapper onClick={onClick}>
    <svg viewBox="0 0 24 24">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  </IconWrapper>
);

// export const FileIcon: React.FC<IconProps> = ({ onClick }) => (
//   <IconWrapper onClick={onClick}>
//     <svg viewBox="0 0 24 24">
//       <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
//     </svg>
//   </IconWrapper>
// ); 