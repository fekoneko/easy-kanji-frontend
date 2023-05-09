import { useState } from 'react';
import useWindowEventListener from './useWindowEventListener';

export type MousePosition = { x: number; y: number };

const useMousePosition = (initialState: MousePosition = { x: 0, y: 0 }) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>(initialState);

  useWindowEventListener('mousemove', (e) => setMousePosition({ x: e.x, y: e.y }));

  return mousePosition;
};
export default useMousePosition;
