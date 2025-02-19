export interface Video {
  id: string;
  title: string;
  path?: string;
  size?: number;
  filename?: string;
  created_at?: number;
}

export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
} 