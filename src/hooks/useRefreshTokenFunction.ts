import { axiosInstance } from '../api/axiosInstance';
import useAuth from './useAuth';

export type RefreshFunction = () => Promise<string | null>;

export const useRefreshTokenFunction = () => {
  const { auth, setAuth } = useAuth();

  const refresh: RefreshFunction = async () => {
    if (!auth) return null;

    try {
      const response = await axiosInstance.get<string>('/tokens/');
      if (response.data) {
        setAuth({ ...auth, accessToken: response.data });
        return response.data;
      }
    } catch {
      setAuth(null);
    }
    return null;
  };

  return refresh;
};
export default useRefreshTokenFunction;
