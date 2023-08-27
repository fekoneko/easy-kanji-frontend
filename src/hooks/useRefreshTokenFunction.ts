import axios from 'axios';
import useAuth from './useAuth';

export type RefreshFunction = () => Promise<string | null>;

export const useRefreshTokenFunction = () => {
  const { auth, setAuth } = useAuth();

  const refresh: RefreshFunction = async () => {
    if (!auth) return null;

    try {
      const response = await axios.get<string>('/tokens/', {
        baseURL: `${import.meta.env.VITE_API_URL}/api`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });

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
