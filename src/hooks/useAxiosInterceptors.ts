import { useEffect } from 'react';
import useAuth from './useAuth';
import useRefreshTokenFunction from './useRefreshTokenFunction';
import { axiosPrivate } from '../api/axios';
import { AxiosError } from 'axios';

export const useAxiosInterceptors = () => {
  const { auth } = useAuth();
  const refresh = useRefreshTokenFunction();

  useEffect(() => {
    const privateRequestInterceptorId = axiosPrivate.interceptors.request.use((requestConfig) => {
      if (!requestConfig.headers.Authorization && auth) {
        requestConfig.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
      return requestConfig;
    });

    const privateResponseInterceptorId = axiosPrivate.interceptors.response.use(
      (responce) => responce,
      async (error: (AxiosError & { config: { refreshed?: boolean } }) | null | undefined) => {
        if (!error) return;

        const requestConfig = error.config;
        if (error.response?.status === 403 && !requestConfig.refreshed) {
          let newAccessToken = await refresh();
          if (!newAccessToken) return;

          requestConfig.refreshed = true;
          requestConfig.headers.Authorization = `Bearer ${newAccessToken}`;
          axiosPrivate(requestConfig);
        }
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(privateRequestInterceptorId);
      axiosPrivate.interceptors.response.eject(privateResponseInterceptorId);
    };
  }, [auth, refresh]);
};
export default useAxiosInterceptors;
