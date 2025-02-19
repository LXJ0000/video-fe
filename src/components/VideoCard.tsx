import React, { useState } from 'react';
import { Card, message } from 'antd';
import styled from 'styled-components';
import { Video } from '../types/video';
import { deleteVideo } from '../services/api';
import VideoForm from './VideoForm';
import VideoPlayer from './VideoPlayer';
import DefaultCover from '../assets/images/default-cover';
import { gradientBg } from '../theme/themeConfig';
import { EditIcon, DeleteIcon, PlayIcon } from './common/icons';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { Actions } from './common/Actions';
import { formatDate } from '../utils/format';

const { Meta } = Card;

const StyledCard = styled(Card)`
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  .ant-card-cover {
    height: 220px;
    position: relative;
    overflow: hidden;
    
    .default-cover {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      background: ${props => props.theme.token.colorBgContainer};
    }

    .play-button-container {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      opacity: 0;
      transition: all 0.3s;

      .anticon {
        font-size: 3rem;
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
        transform: scale(0.8);
        transition: all 0.3s;
      }
    }
    
    &:hover {
      .play-button-container {
        opacity: 1;
        .anticon {
          transform: scale(1);
        }
      }
      .default-cover {
        transform: scale(1.1);
      }
    }
  }

  .ant-card-meta {
    margin: 16px;
    
    .ant-card-meta-title {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
      color: ${props => props.theme.token.colorText};
    }

    .ant-card-meta-description {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: ${props => props.theme.token.colorTextSecondary};
      font-size: 14px;
      
      .info {
        display: flex;
        gap: 16px;
        
        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }

  .ant-card-actions {
    background: transparent;
    border-top: 1px solid ${props => props.theme.token.colorBorder};
    padding: 12px;
    
    li {
      margin: 0 8px;
    }

    .anticon {
      color: ${props => props.theme.token.colorText} !important;
      font-size: 20px;
      transition: all 0.3s;
      opacity: 0.7;
      
      &:hover {
        opacity: 1;
        transform: scale(1.2);
        background: ${gradientBg.light};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
`;

interface Props {
  video: Video;
  onSuccess: () => void;
}

const VideoCard: React.FC<Props> = ({ video, onSuccess }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await deleteVideo(video.id);
      if (response.code === 0) {
        message.success('删除成功');
        onSuccess();
      } else {
        message.error(response.msg);
      }
    } catch (error) {
      message.error('删除失败');
    }
    setIsDeleteModalVisible(false);
  };

  return (
    <>
      <StyledCard
        cover={
          <div onClick={() => setIsPlayerVisible(true)}>
            <div className="default-cover">
              <DefaultCover />
              <div className="play-button-container">
                <PlayIcon />
              </div>
            </div>
          </div>
        }
        actions={[
          <EditIcon key="edit" onClick={() => setIsEditModalVisible(true)} />,
          <DeleteIcon key="delete" onClick={() => setIsDeleteModalVisible(true)} />,
        ]}
      >
        <Meta
          title={video.title}
          description={
            <div className="info">
              <span>
                {/* <ClockIcon /> */}
                {formatDate(video.created_at)}
              </span>
            </div>
          }
        />
      </StyledCard>

      <Modal
        visible={isDeleteModalVisible}
        title="确认删除"
        onClose={() => setIsDeleteModalVisible(false)}
        footer={
          <Actions>
            <Button onClick={() => setIsDeleteModalVisible(false)}>取消</Button>
            <Button variant="primary" onClick={handleDelete}>确定</Button>
          </Actions>
        }
      >
        <p>确定要删除这个视频吗？</p>
      </Modal>

      <VideoForm
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSuccess={() => {
          setIsEditModalVisible(false);
          onSuccess();
        }}
        initialValues={video}
        isEdit
      />

      <VideoPlayer
        visible={isPlayerVisible}
        onClose={() => setIsPlayerVisible(false)}
        video={video}
      />
    </>
  );
};

export default VideoCard; 