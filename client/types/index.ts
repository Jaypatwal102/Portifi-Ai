export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
}

export interface ApiError {
  message: string;
}
