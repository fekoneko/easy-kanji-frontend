import { WanakanaOptions, bind, unbind } from 'wanakana';
import { RefObject, useEffect } from 'react';

// Warning! Use onInput instead of onChange in binded element to let React detect all the value chnages
const useWanaKana = (
  bindRef: RefObject<HTMLInputElement | HTMLTextAreaElement>,
  options?: WanakanaOptions
) => {
  useEffect(() => {
    if (bindRef.current) bind(bindRef.current, options);
    return () => {
      if (bindRef.current) unbind(bindRef.current);
    };
  }, []);
};
export default useWanaKana;
