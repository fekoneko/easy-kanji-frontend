import { useContext } from 'react';
import modalContext from '../contexts/modalContext';

const useModal = () => {
  return useContext(modalContext);
};
export default useModal;
