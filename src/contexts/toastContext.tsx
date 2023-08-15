import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import ToastMessage from '../components/overlays/ToastMessage';

const POPUP_TIMEOUT = 1500;

export type ShowToastFunction = (toastContents: ReactNode) => void;

type ToastContextValue = {
  showPopup: ShowToastFunction;
};
type ToastContextProviderProps = { children: ReactNode };

const toastContext = createContext({} as ToastContextValue);

export const ToastContextProvider = ({ children }: ToastContextProviderProps) => {
  const [popupMessageShown, setPopupMessageShown] = useState(false);
  const [popupContent, setPopupContent] = useState<ReactNode>(null);
  const [popupKey, setPopupKey] = useState(0);
  const popupTimeoutRef = useRef<number | null>(null);

  const showPopup: ShowToastFunction = (popupContent: ReactNode) => {
    setPopupMessageShown(true);
    setPopupContent(popupContent);
    setPopupKey((prev) => prev + 1);
  };

  useEffect(() => {
    const hidePopup = () => {
      setPopupMessageShown(false);
    };
    popupTimeoutRef.current = setTimeout(hidePopup, POPUP_TIMEOUT);
    return () => {
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    };
  }, [popupKey]);

  return (
    <toastContext.Provider value={{ showPopup }}>
      {children}
      <ToastMessage popupKey={popupKey} shown={popupMessageShown}>
        {popupContent}
      </ToastMessage>
    </toastContext.Provider>
  );
};

export default toastContext;
