import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';

export type SetErrorStatus = Dispatch<SetStateAction<number | null>>;
export type SetLoading = Dispatch<SetStateAction<boolean>>;

export const catchAxiosErrors = async <T>(
  getResponse: () => Promise<AxiosResponse<T>>,
  setErrorStatus?: SetErrorStatus,
  setLoading?: SetLoading
): Promise<[data: T | null, errorStatus: number | null]> => {
  try {
    if (setLoading) setLoading(true);
    const response = await getResponse();
    if (setErrorStatus) setErrorStatus(null);
    if (setLoading) setLoading(false);
    return [response.data, null];
  } catch (axiosErr: any) {
    const errorStatus =
      typeof axiosErr?.response?.status === 'number' ? axiosErr.response.status : null;
    // Warning: this may happen when the component is already unmounted or remaunted
    if (errorStatus) {
      if (setErrorStatus) setErrorStatus(errorStatus);
      if (setLoading) setLoading(false);
    }
    return [null, errorStatus];
  }
};
