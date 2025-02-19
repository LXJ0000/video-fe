import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Video } from '../types/video';
import { updateVideo } from '../services/api';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { Actions } from './common/Actions';
import { toast } from './common/Toast';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.token.colorText};
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.token.colorBorder};
  background: ${props => props.theme.token.colorBgContainer};
  color: ${props => props.theme.token.colorText};
  font-size: 16px;
  transition: all 0.3s;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.token.colorPrimary};
    box-shadow: 0 0 0 2px ${props => props.theme.token.colorPrimaryBg};
  }
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.theme.token.colorBorder};
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.theme.token.colorBgContainer};
  
  &.dragging {
    border-color: ${props => props.theme.token.colorPrimary};
    background: ${props => props.theme.token.colorPrimaryBg};
  }

  p {
    color: ${props => props.theme.token.colorText};
    margin: 0;
    
    &:first-child {
      margin-bottom: 8px;
    }
  }
`;

const ProgressBar = styled.div<{ percent: number }>`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.percent}%;
    background: ${props => props.theme.token.colorPrimary};
    transition: width 0.3s ease;
  }
`;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialValues?: Video;
  isEdit?: boolean;
}

const VideoForm: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
  initialValues,
  isEdit = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEdit && initialValues) {
        const response = await updateVideo(initialValues.id, { title });
        if (response.code === 0) {
          alert('更新成功');
          onSuccess();
          onClose();
        } else {
          alert(response.msg);
        }
      } else {
        if (!file) {
          alert('请上传视频文件');
          return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://pttvsbqwuxej.sealosgzg.site/api/video/upload', true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.code === 0) {
              // alert('上传成功');
              onSuccess();
              onClose();
            } else {
              // alert(response.msg || '上传失败');
            }
          } else {
            // alert('上传失败');
          }
          setUploading(false);
          setProgress(0);
        };

        xhr.onerror = () => {
          // alert('上传失败');  
          setUploading(false);
          setProgress(0);
        };

        xhr.send(formData);
      }
    } catch (error) {
      // alert(`${isEdit ? '更新' : '添加'}失败`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const isVideo = /\.(mp4|avi|mov|wmv|flv|mkv)$/i.test(selectedFile.name);
    if (!isVideo) {
      alert('只能上传视频文件！');
      return;
    }

    const isLt500M = selectedFile.size / 1024 / 1024 < 500;
    if (!isLt500M) {
      alert('视频大小不能超过 500MB！');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
    } else {
      toast.error('请上传视频文件');
    }
  };

  return (
    <Modal
      visible={visible}
      title={isEdit ? '编辑视频' : '添加视频'}
      onClose={onClose}
      showDefaultFooter={false}
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>视频标题</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入视频标题"
            required
          />
        </FormGroup>

        {!isEdit && (
          <FormGroup>
            <Label>上传视频</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".mp4,.avi,.mov,.wmv,.flv,.mkv"
              style={{ display: 'none' }}
            />
            <UploadArea 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={isDragging ? 'dragging' : ''}
            >
              {file ? (
                <p>{file.name}</p>
              ) : (
                <>
                  <p>点击或拖拽视频文件到此区域上传</p>
                  <p style={{ fontSize: '12px', opacity: 0.6 }}>
                    支持 mp4, avi, mov, wmv, flv, mkv 格式，大小不超过 500MB
                  </p>
                </>
              )}
            </UploadArea>
          </FormGroup>
        )}

        {uploading && <ProgressBar percent={progress} />}

        <Actions>
          <Button onClick={onClose}>取消</Button>
          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading ? '上传中...' : '确定'}
          </Button>
        </Actions>
      </Form>
    </Modal>
  );
};

export default VideoForm; 