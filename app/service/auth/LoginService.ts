import { API_URL } from "@/app/constants";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  data?: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: {
      id: number;
      roles: string[];
      username: string;
    };
  } | null;
  status?: {
    code: string;
    message: string;
  };
}

export const isLoginSuccess = (res: LoginResponse | null): boolean =>
  !!res?.data?.accessToken && res.status?.message === "LOGIN_SUCCESS";

export const loginService = async (
  user: LoginRequest
): Promise<LoginResponse | null> => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
