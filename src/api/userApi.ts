import { catchAxiosErrors, SetErrorStatus } from '../controllers/axiosController';
import { Auth } from '../contexts/authContext';
import { axiosPrivate } from './axios';

export default {
  async signIn(
    username: string,
    password: string,
    setErrorStatus?: SetErrorStatus
  ): Promise<Auth | null> {
    const responceData = await catchAxiosErrors<Partial<Auth>>(
      () => axiosPrivate.post('/tokens/', { username, password }),
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
      () => axiosPrivate.post('/users/', { username, password }),
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
