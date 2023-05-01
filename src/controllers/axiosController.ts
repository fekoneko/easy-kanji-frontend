import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';

export type SetErrorStatus = Dispatch<SetStateAction<number | null>>;

export const catchAxiosErrors = async <T>(
  getResponse: () => Promise<AxiosResponse<T>>,
  setErrorStatus?: SetErrorStatus
): Promise<[data: T | null, errorStatus: number | null]> => {
  try {
    const response = await getResponse();
    if (setErrorStatus) setErrorStatus(null);
    return [response.data, null];
  } catch (axiosErr: any) {
    const errorStatus =
      typeof axiosErr?.response?.status === 'number' ? axiosErr.response.status : null;
    if (setErrorStatus) setErrorStatus(errorStatus);
    return [null, errorStatus];
  }
};
