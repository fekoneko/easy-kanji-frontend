import axios from 'axios';
import useAuth from './useAuth';
import { getFromLocalStorage, setInLocalStorage } from '../controllers/localStorageController';

export type RefreshFunction = () => Promise<string | null>;

type RefreshResponseData = { accessToken: string; refreshToken: string };

export const useRefreshFunction = () => {
  const { auth, setAuth } = useAuth();

  const refresh: RefreshFunction = async () => {
    const refreshToken = getFromLocalStorage<string>('_rt');
    if (!refreshToken) return null;

    try {
      const response = await axios.post<RefreshResponseData>(
        '/tokens/',
        { refreshToken },
        {
          baseURL: `${import.meta.env.VITE_API_URL}/api`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: auth ? `Bearer ${auth.accessToken}` : undefined,
          },
          withCredentials: true,
        }
      );
      if (!response.data.accessToken) return null;

      setAuth((prev) =>
        prev
          ? { ...prev, accessToken: response.data.accessToken }
          : { id: 0, username: '', roles: [], accessToken: response.data.accessToken }
      );
      setInLocalStorage('_rt', response.data.refreshToken);

      return response.data.accessToken;
    } catch {
      setAuth(null);
      return null;
    }
  };

  return refresh;
};
export default useRefreshFunction;
