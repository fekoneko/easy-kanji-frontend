import axios from 'axios';
import { catchAxiosErrors, SetErrorStatus } from '../controllers/axiosController';
import { Auth } from '../contexts/globalContext';

const usersAxios = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/users`,
  withCredentials: true,
});

const tokensAxios = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/tokens`,
  withCredentials: true,
});

export default {
  async signIn(
    username: string,
    password: string,
    setErrorStatus?: SetErrorStatus
  ): Promise<Auth | null> {
    const responceData = await catchAxiosErrors<Partial<Auth>>(
      () => tokensAxios.post('/', { username, password }),
      setErrorStatus
    );
    if (typeof responceData?.roles === 'object' && typeof responceData?.accessToken === 'string') {
      return {
        username,
        password,
        roles: responceData.roles,
        accessToken: responceData.accessToken,
      };
    } else return null;
  },

  async signUp(
    username: string,
    password: string,
    setErrorStatus?: SetErrorStatus
  ): Promise<Auth | null> {
    const responceData = await catchAxiosErrors<Partial<Auth>>(
      () => usersAxios.post('/', { username, password }),
      setErrorStatus
    );
    if (typeof responceData?.roles === 'object' && typeof responceData?.accessToken === 'string') {
      return {
        username,
        password,
        roles: responceData.roles,
        accessToken: responceData.accessToken,
      };
    } else return null;
  },
};
