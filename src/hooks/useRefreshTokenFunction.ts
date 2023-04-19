import axios from 'axios';
import useAuth from './useAuth';

export const useRefreshTokenFunction = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async (): Promise<string | null> => {
    if (!auth) return null;

    try {
      const responce = await axios.get<string>('/tokens', {
        baseURL: `${import.meta.env.VITE_API_URL}/api`,
      });
      const newAccessToken = responce.data;
      setAuth({ ...auth, accessToken: newAccessToken });
      return newAccessToken;
    } catch (error: any) {
      if (!error?.response) return null;

      // Refresh token expired
      setAuth(null);
      return null;
    }
  };
  return refresh;
};
export default useRefreshTokenFunction;
