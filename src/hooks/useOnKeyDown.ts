import { DependencyList } from 'react';
import useWindowEventListener from './useWindowEventListener';

type Modifiers = {
  control?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
};

const useOnKeyDown = (
  key: string,
  callback: (e: KeyboardEvent) => any,
  deps?: DependencyList,
  modifiers?: Modifiers
) => {
  useWindowEventListener(
    'keydown',
    (e) => {
      if (
        e.key === key &&
        (!modifiers ||
          (e.ctrlKey == modifiers.control &&
            e.shiftKey == modifiers.shift &&
            e.altKey == modifiers.alt &&
            e.metaKey == modifiers.meta))
      ) {
        callback(e);
      }
    },
    (deps ?? []).concat([modifiers])
  );
};
export default useOnKeyDown;
