import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';

export type SetErrorStatus = Dispatch<SetStateAction<number | null>>;

export const catchAxiosErrors = async <T>(
  getResponse: () => Promise<AxiosResponse<T>>,
  setErrorStatus?: SetErrorStatus
): Promise<T | null> => {
  try {
    const response = await getResponse();
    if (setErrorStatus) setErrorStatus(null);
    return response.data;
  } catch (axiosErr: any) {
    if (setErrorStatus) {
      setErrorStatus(
        typeof axiosErr?.response?.status === 'number' ? axiosErr.response.status : null
      );
    }
    return null;
  }
};
