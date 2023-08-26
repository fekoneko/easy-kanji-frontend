import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import ToastMessage from '../components/overlays/ToastMessage';

const POPUP_TIMEOUT = 1500;

export type ShowToastFunction = (toastContents: ReactNode) => void;

type ToastContextValue = {
  showToast: ShowToastFunction;
};
type ToastContextProviderProps = { children: ReactNode };

const toastContext = createContext({} as ToastContextValue);

export const ToastContextProvider = ({ children }: ToastContextProviderProps) => {
  const [toastShown, setToastShown] = useState(false);
  const [toastMessage, setToastMessage] = useState<ReactNode>(null);
  const [toastKey, setToastKey] = useState(0);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast: ShowToastFunction = (toastContent: ReactNode) => {
    setToastShown(true);
    setToastMessage(toastContent);
    setToastKey((prev) => prev + 1);
  };

  useEffect(() => {
    const hideToast = () => {
      setToastShown(false);
    };
    toastTimeoutRef.current = setTimeout(hideToast, POPUP_TIMEOUT);
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [toastKey]);

  return (
    <toastContext.Provider value={{ showToast }}>
      {children}
      <ToastMessage toastKey={toastKey} shown={toastShown}>
        {toastMessage}
      </ToastMessage>
    </toastContext.Provider>
  );
};

export default toastContext;
