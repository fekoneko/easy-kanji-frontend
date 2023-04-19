import { SetErrorStatus, catchAxiosErrors } from '../controllers/axiosController';
import { axiosPrivate } from './axios';

export default {
  async send(
    body: string,
    username?: string,
    email?: string,
    setErrorStatus?: SetErrorStatus
  ): Promise<void> {
    await catchAxiosErrors<null>(
      () => axiosPrivate.post('/feedback/', { username, body, email }),
      setErrorStatus
    );
  },
};
