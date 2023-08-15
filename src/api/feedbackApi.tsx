import { SetErrorStatus, catchAxiosErrors } from '../controllers/axiosController';
import { axiosInstance } from './axiosInstance';

export default {
  async send(
    body: string,
    username?: string,
    email?: string,
    setErrorStatus?: SetErrorStatus
  ): Promise<void> {
    await catchAxiosErrors<null>(
      () => axiosInstance.post('/feedback/', { username, body, email }),
      setErrorStatus
    );
  },
};
