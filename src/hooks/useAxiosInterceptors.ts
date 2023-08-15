import { useEffect } from 'react';
import useAuth from './useAuth';
import useRefreshTokenFunction from './useRefreshTokenFunction';
import { axiosInstance } from '../api/axiosInstance';
import { AxiosError } from 'axios';

export const useAxiosInterceptors = () => {
  const { auth } = useAuth();
  const refresh = useRefreshTokenFunction();

  useEffect(() => {
    if (!auth) return;

    const privateRequestInterceptorId = axiosInstance.interceptors.request.use((requestConfig) => {
      if (!requestConfig.headers.Authorization && auth) {
        requestConfig.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
      return requestConfig;
    });

    const privateResponseInterceptorId = axiosInstance.interceptors.response.use(
      undefined,
      async (
        axiosErr: (AxiosError & { config: { refreshed?: boolean } }) | null | undefined
      ): Promise<AxiosError | Response | undefined> => {
        if (!axiosErr) return;

        const requestConfig = axiosErr.config;
        if (axiosErr.response?.status === 401 && !requestConfig.refreshed) {
          let newAccessToken = await refresh();
          if (newAccessToken) {
            requestConfig.refreshed = true;
            requestConfig.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(requestConfig);
          }
        }
        return Promise.reject(axiosErr);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(privateRequestInterceptorId);
      axiosInstance.interceptors.response.eject(privateResponseInterceptorId);
    };
  }, [auth, refresh]);
};
export default useAxiosInterceptors;
