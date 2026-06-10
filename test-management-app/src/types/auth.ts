export interface LoginPayload {
  userId: string;
  password: string;
}

export interface User {
  id?: string;
  name?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}