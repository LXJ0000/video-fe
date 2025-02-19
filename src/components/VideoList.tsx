import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Video } from '../types/video';
import { getAllVideos } from '../services/api';
import VideoCard from './VideoCard';
import VideoForm from './VideoForm';
import { gradientBg } from '../theme/themeConfig';
import { toast } from './common/Toast';

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 24px;
  
  // 隐藏滚动条但保持滚动功能
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // IE and Edge
  &::-webkit-scrollbar {
    display: none; // Chrome, Safari, Opera
  }
`;

const Header = styled.div`
  margin-bottom: 48px;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${gradientBg.light};
    border-radius: 2px;
  }
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
  background: ${gradientBg.light};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(255, 60, 172, 0.2);
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${props => props.theme.token.colorText};
  opacity: 0.8;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const AddButton = styled.button`
  width: 100%;
  aspect-ratio: 16/9;
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${gradientBg.light};
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    
    &::before {
      opacity: 0.15;
    }
    
    span {
      transform: scale(1.1);
    }
  }

  span {
    position: relative;
    font-size: 24px;
    font-weight: 600;
    color: ${props => props.theme.token.colorText};
    transition: transform 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    
    &::before {
      content: '+';
      font-size: 32px;
      margin-right: 8px;
      background: ${gradientBg.light};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transform-origin: center;
    }
  }

  &:hover span::before {
    transform: scale(1.2);
  }
`;

const LoadingOverlay = styled.div<{ visible: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: all 0.3s;
  z-index: 1000;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  border-top-color: ${props => props.theme.token.colorPrimary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  
  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
    background: ${gradientBg.light};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    color: ${props => props.theme.token.colorText};
    opacity: 0.6;
  }
`;

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <>
      <Container>
        <Header>
          <Title>视频空间</Title>
          <Subtitle>分享你的精彩时刻</Subtitle>
        </Header>
        
        <Grid>
          <AddButton onClick={() => setIsModalVisible(true)}>
            <span>添加视频</span>
          </AddButton>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onSuccess={fetchVideos}
            />
          ))}
        </Grid>

        {!loading && videos.length === 0 && (
          <EmptyState>
            <h3>开始上传你的第一个视频</h3>
            <p>支持多种格式，让创作更自由</p>
          </EmptyState>
        )}
      </Container>

      <LoadingOverlay visible={loading}>
        <Spinner />
      </LoadingOverlay>

      <VideoForm
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          fetchVideos();
        }}
      />
    </>
  );
};

export default VideoList; 