import { createContext, ReactNode, useState } from 'react';
import ModalWindow from '../components/overlays/ModalWindow';

export type ShowModalFunction = (modalContents: ReactNode) => void;
export type CloseModalFunction = () => void;

type ModalContextValue = {
  showModal: ShowModalFunction;
  closeModal: CloseModalFunction;
};
type ModalContextProviderProps = { children: ReactNode };

const modalContext = createContext({} as ModalContextValue);

export const ModalContextProvider = ({ children }: ModalContextProviderProps) => {
  const [modalWindowShown, setModalWindowShown] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  const showModal: ShowModalFunction = (modalContent: ReactNode) => {
    setModalWindowShown(true);
    setModalContent(modalContent);
  };

  const closeModal: CloseModalFunction = () => {
    setModalWindowShown(false);
  };

  return (
    <modalContext.Provider value={{ showModal, closeModal }}>
      {children}
      <ModalWindow shown={modalWindowShown}>{modalContent}</ModalWindow>
    </modalContext.Provider>
  );
};

export default modalContext;
