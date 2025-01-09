import ApiService from "../services/api";

const AuthEndpoint = "Auth";

interface UserLoginRequest {
  username?: string;
  password?: string;
}

export const loginAsync = async (request: UserLoginRequest) => {
  console.log("🚀 ~ loginAsync ~ request:", request);
  const res = await ApiService.post<string>(`${AuthEndpoint}/login`, request);
  console.log("🚀 ~ postBookingAsync ~ res:", res);
  localStorage.setItem("token", res?.data);
};
