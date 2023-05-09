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
          ((modifiers.control === undefined || e.ctrlKey === !!modifiers.control) &&
            (modifiers.shift === undefined || e.shiftKey === !!modifiers.shift) &&
            (modifiers.alt === undefined || e.altKey === !!modifiers.alt) &&
            (modifiers.meta === undefined || e.metaKey === !!modifiers.meta)))
      ) {
        callback(e);
        console.log(e.shiftKey);
      }
    },
    (deps ?? []).concat([modifiers])
  );
};
export default useOnKeyDown;
