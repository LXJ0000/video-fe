import React, { useRef } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { Video } from '../types/video';

const VideoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  video {
    width: 100%;
    max-height: 70vh;
    object-fit: contain;
  }
`;

interface Props {
  visible: boolean;
  onClose: () => void;
  video: Video;
}

const VideoPlayer: React.FC<Props> = ({ visible, onClose, video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = video.path?.startsWith('http') 
    ? video.path 
    : video.path 
      ? `https://pttvsbqwuxej.sealosgzg.site/uploads/videos/${video.path.split('/').pop()}`
      : '';

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose();
  };

  return (
    <Modal
      title={video.title}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width="80%"
      centered
      destroyOnClose
    >
      <VideoContainer>
        <video
          ref={videoRef}
          controls
          autoPlay
          src={videoUrl}
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          style={{ maxWidth: '100%' }}
        >
          您的浏览器不支持 HTML5 视频播放
        </video>
      </VideoContainer>
    </Modal>
  );
};

export default VideoPlayer; 