import ApiService from "../services/api";

const AuthEndpoint = "Auth";

interface UserLoginRequest {
  username?: string;
  password?: string;
}

export const loginAsync = async (request: UserLoginRequest) => {
  const res = await ApiService.post<string>(`${AuthEndpoint}/login`, request);
  localStorage.setItem("token", res?.data);
};
