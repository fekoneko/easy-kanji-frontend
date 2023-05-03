import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import PopupMessage from '../components/overlays/PopupMessage';

const POPUP_TIMEOUT = 1500;

export type ShowPopupFunction = (modalContents: ReactNode) => void;

type PopupContextValue = {
  showPopup: ShowPopupFunction;
};
type PopupContextProviderProps = { children: ReactNode };

const popupContext = createContext({} as PopupContextValue);

export const PopupContextProvider = ({ children }: PopupContextProviderProps) => {
  const [popupMessageShown, setPopupMessageShown] = useState(false);
  const [popupContent, setPopupContent] = useState<ReactNode>(null);
  const [popupKey, setPopupKey] = useState(0);
  const popupTimeoutRef = useRef<number | null>(null);

  const showPopup: ShowPopupFunction = (popupContent: ReactNode) => {
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
    <popupContext.Provider value={{ showPopup }}>
      {children}
      <PopupMessage popupKey={popupKey} shown={popupMessageShown}>
        {popupContent}
      </PopupMessage>
    </popupContext.Provider>
  );
};

export default popupContext;
