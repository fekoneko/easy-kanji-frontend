import { useEffect, useRef } from 'react';

const useAbortController = () => {
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    if (abortControllerRef.current.signal.aborted)
      abortControllerRef.current = new AbortController();
    return () => abortControllerRef.current.abort();
  }, []);

  return abortControllerRef;
};
export default useAbortController;
