import useAuth from './useAuth';
import { catchAxiosErrors } from '../controllers/axiosController';
import { axiosPublic } from '../api/axios';

export const useRefreshTokenFunction = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async (): Promise<string | null> => {
    if (!auth) return null;

    const [newAccessToken, errorStatus] = await catchAxiosErrors<string>(() =>
      axiosPublic.get('/tokens/', {
        withCredentials: true,
      })
    );
    if (newAccessToken) {
      setAuth({ ...auth, accessToken: newAccessToken });
      return newAccessToken;
    }
    if (errorStatus) setAuth(null);
    return null;
  };
  return refresh;
};
export default useRefreshTokenFunction;
