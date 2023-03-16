import { useEffect, useState } from 'react';

const useKeyPressed = (key: string, initialState: boolean = false) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(initialState);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === key) setKeyPressed(true);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === key) setKeyPressed(false);
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keyPressed;
};
export default useKeyPressed;
