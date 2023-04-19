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
        roles: responceData.roles,
        accessToken: responceData.accessToken,
      };
    } else return null;
  },

  async signUp(
    username: string,
    password: string,
    setRegErrorStatus?: SetErrorStatus,
    setLogErrorStatus?: SetErrorStatus
  ): Promise<Auth | null> {
    const regResponceData = await catchAxiosErrors<Partial<Auth>>(
      () => axiosPrivate.post('/users/', { username, password }),
      setRegErrorStatus
    );
    if (!regResponceData) return null;

    const logResponceData = await this.signIn(username, password, setLogErrorStatus);
    if (
      typeof logResponceData?.roles === 'object' &&
      typeof logResponceData?.accessToken === 'string'
    ) {
      return {
        username,
        roles: logResponceData.roles,
        accessToken: logResponceData.accessToken,
      };
    } else return null;
  },
};
