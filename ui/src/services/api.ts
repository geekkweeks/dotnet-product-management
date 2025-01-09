import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

// Create an instance of axios with some default configuration
class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add Bearer token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token"); // Adjust the token retrieval logic as needed
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptors for response handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Return the error response for consistent handling
        if (error.response) {
          return Promise.reject(error.response);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(
    url: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(url, {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T>>(url);
      return response.data;
    } catch (error: any) {
      throw this.handleApiError(error);
    }
  }

  private handleApiError(error: any): ApiResponse<null> {
    // Standardize error response
    return {
      statusCode: error.status || 500,
      message: error.data?.message || "An unexpected error occurred.",
      data: null,
      errors: error.data?.errors || [error.message],
    };
  }
}

export default new ApiService(BASE_API_URL); // Replace with your API base URL
