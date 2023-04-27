import { useState } from 'react';
import useWindowEventListener from './useWindowEventListener';

const useKeyPressed = (key: string, initialState: boolean = false) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(initialState);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === key) setKeyPressed(true);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === key) setKeyPressed(false);
  };

  useWindowEventListener('keydown', handleKeyDown);
  useWindowEventListener('keyup', handleKeyUp);

  return keyPressed;
};
export default useKeyPressed;
