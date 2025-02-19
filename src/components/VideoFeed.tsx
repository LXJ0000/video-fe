import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getAllVideos } from '../services/api';
import { Video } from '../types/video';
import { toast } from './common/Toast';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  overflow: hidden;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: none;
`;

const VideoWrapper = styled.div<{ active: boolean; isDragging: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: ${props => props.isDragging ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'};
  transform: translateY(${props => (props.active ? '0' : '100%')});
  will-change: transform;
  opacity: ${props => props.active ? 1 : 0};
  
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: black;
  }
`;

const VideoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  
  h3 {
    font-size: 18px;
    margin: 0;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    margin: 0;
    opacity: 0.8;
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: ${props => props.theme.token.colorPrimary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const NavigationButton = styled.button<{ direction: 'up' | 'down' }>`
  position: absolute;
  ${props => props.direction === 'up' ? 'top: 40%' : 'bottom: 40%'};
  right: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
  backdrop-filter: blur(4px);
  font-size: 20px;
  color: white;
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: scale(1.1);
  }
`;

const PlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  backdrop-filter: blur(4px);
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const VideoFeed: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowDown' && currentIndex < videos.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await getAllVideos();
      if (response.code === 0) {
        setVideos(response.data || []);
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      toast.error('获取视频列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;
    
    if (Math.abs(diff) > 100) { // 滑动距离超过100px才触发切换
      if (diff > 0 && currentIndex > 0) {
        // 向下滑，显示上一个视频
        setCurrentIndex(prev => prev - 1);
      } else if (diff < 0 && currentIndex < videos.length - 1) {
        // 向上滑，显示下一个视频
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'next' && currentIndex < videos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const getVideoUrl = (video: Video) => {
    return video.path?.startsWith('http') 
      ? video.path 
      : video.path 
        ? `https://pttvsbqwuxej.sealosgzg.site/uploads/videos/${video.path.split('/').pop()}`
        : '';
  };

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return '未知时间';
    return new Date(timestamp).toLocaleString();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const diff = e.clientY - dragStartY.current;
    // 添加阻尼效果，使滑动更流畅
    const dampedDiff = diff * 0.5;
    
    // 添加视觉反馈
    if (Math.abs(dampedDiff) > 20) {
      const videoWrapper = e.currentTarget as HTMLElement;
      videoWrapper.style.transform = `translateY(${dampedDiff}px)`;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const diff = e.clientY - dragStartY.current;
    
    if (Math.abs(diff) > 100) {
      if (diff > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (diff < 0 && currentIndex < videos.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }
    
    // 重置视觉效果
    const videoWrapper = e.currentTarget as HTMLElement;
    videoWrapper.style.transform = '';
    setIsDragging(false);
  };

  const togglePlay = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
      } else {
        currentVideo.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 在视频切换时自动播放
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && isPlaying) {
      currentVideo.play();
    }
  }, [currentIndex, isPlaying]);

  // 添加视频预加载
  useEffect(() => {
    const preloadNextVideo = () => {
      if (currentIndex < videos.length - 1) {
        const nextVideo = videos[currentIndex + 1];
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'video';
        link.href = getVideoUrl(nextVideo);
        document.head.appendChild(link);
      }
    };

    preloadNextVideo();
  }, [currentIndex, videos]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (videos.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <VideoContainer
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {currentIndex > 0 && (
          <NavigationButton
            direction="up"
            onClick={() => handleNavigate('prev')}
          >
            ↑
          </NavigationButton>
        )}
        
        {currentIndex < videos.length - 1 && (
          <NavigationButton
            direction="down"
            onClick={() => handleNavigate('next')}
          >
            ↓
          </NavigationButton>
        )}

        {videos.map((video, index) => (
          <VideoWrapper
            key={video.id}
            active={index === currentIndex}
            isDragging={isDragging}
          >
            <video
              ref={el => videoRefs.current[index] = el}
              src={getVideoUrl(video)}
              autoPlay={index === currentIndex && isPlaying}
              loop
              playsInline
              muted={index !== currentIndex}
              controls={false}
              style={{ display: Math.abs(index - currentIndex) <= 1 ? 'block' : 'none' }}
            />
            {index === currentIndex && (
              <PlayButton onClick={togglePlay}>
                {isPlaying ? '⏸' : '▶'}
              </PlayButton>
            )}
            <VideoInfo>
              <h3>{video.title}</h3>
              <p>上传时间：{formatDate(video.created_at)}</p>
            </VideoInfo>
          </VideoWrapper>
        ))}
      </VideoContainer>
    </Container>
  );
};

export default VideoFeed; 