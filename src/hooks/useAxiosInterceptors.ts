import { useEffect } from 'react';
import useAuth from './useAuth';
import useRefreshFunction from './useRefreshFunction';
import { axiosInstance } from '../api/axiosInstance';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const useAxiosInterceptors = () => {
  const { auth } = useAuth();
  const refresh = useRefreshFunction();

  useEffect(() => {
    if (!auth) return;

    const requestInterceptorId = axiosInstance.interceptors.request.use((requestConfig) => {
      if (requestConfig.headers.Authorization === undefined) {
        requestConfig.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
      if (requestConfig.headers.Authorization === '') {
        requestConfig.headers.Authorization = undefined;
      }
      return requestConfig;
    });

    const responseInterceptorId = axiosInstance.interceptors.response.use(
      undefined,
      async (
        axiosErr: (AxiosError & { config: { _refreshed?: boolean } }) | null | undefined
      ): Promise<AxiosError | Response | undefined> => {
        if (!axiosErr) return;

        const requestConfig = axiosErr.config;
        if (axiosErr.response?.status === 401 && !requestConfig._refreshed) {
          let newAccessToken = await refresh();
          if (newAccessToken) {
            requestConfig._refreshed = true;
            requestConfig.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(requestConfig);
          }
        }
        return Promise.reject(axiosErr);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptorId);
      axiosInstance.interceptors.response.eject(responseInterceptorId);
    };
  }, [auth, refresh]);
};
export default useAxiosInterceptors;
