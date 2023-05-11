import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getFromLocalStorage, setInLocalStorage } from '../controllers/localStorageController';

const useSetting = <T>(
  settingName: string,
  defaultValue: T
): [setting: T, setSetting: Dispatch<SetStateAction<T>>] => {
  const [setting, setSetting] = useState<T>(
    getFromLocalStorage<T>(`setting_${settingName}`) ?? defaultValue
  );

  useEffect(() => {
    setInLocalStorage(`setting_${settingName}`, setting);
  }, [setting]);

  return [setting, setSetting];
};
export default useSetting;
