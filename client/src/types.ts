import { AxiosError, AxiosResponse } from "axios";

export interface ApiError<T> extends AxiosError {
  response?: AxiosResponse<T>;
}

export interface SignupError {
  error?: string;
  message?: string;
}

export interface LoginError {
  error?: string;
  message?: string;
}

export interface UserUpdateError {
  error?: string;
  message?: string;
}

export interface PasswordUpdateError {
  error?: string;
  message?: string;
}

export interface User {
  _id?: string;
  firstName: string;
  lastName?: string;
  userName: string;
  email: string;
  providerId?: string;
  age?: number;
  gender?: string;
  location?: string;
  bio?: string;
  profilePic?: string;
  coverPic?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUser {
  firstName: string;
  lastName?: string;
  userName: string;
  age?: number;
  gender?: string;
  location?: string;
  bio?: string;
  profilePic?: string;
  skills?: string[];
}

export interface SignupProps {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  location: string;
  profession: string;
}

export interface LoginProps {
  loginIdentifier: string;
  password: string;
}
