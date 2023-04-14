import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';

export type SetErrorStatus = Dispatch<SetStateAction<number | undefined>>;

export const catchAxiosErrors = async <T>(
  axiosAction: () => Promise<AxiosResponse<T>>,
  setErrorStatus?: SetErrorStatus
): Promise<T | null> => {
  try {
    const response = await axiosAction();
    if (setErrorStatus) setErrorStatus(undefined);
    return response.data;
  } catch (axiosErr: any) {
    if (setErrorStatus) {
      if (!axiosErr?.response) setErrorStatus(undefined);
      else setErrorStatus(axiosErr.response?.status);
    }
    return null;
  }
};
