import axios from 'axios';
import { Video, ApiResponse } from '../types/video';

const BASE_URL = 'https://pttvsbqwuxej.sealosgzg.site';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllVideos = async (): Promise<ApiResponse<Video[]>> => {
  const response = await api.get('/api/video/all');
  return response.data;
};

export const addVideo = async (video: Omit<Video, 'id'>): Promise<ApiResponse<Video>> => {
  const response = await api.post('/api/video/add', video);
  return response.data;
};

export const updateVideo = async (id: string, video: Omit<Video, 'id'>): Promise<ApiResponse<Video>> => {
  const response = await api.post(`/api/video/update?id=${id}`, video);
  return response.data;
};

export const deleteVideo = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.post(`/api/video/del?id=${id}`);
  return response.data;
}; 