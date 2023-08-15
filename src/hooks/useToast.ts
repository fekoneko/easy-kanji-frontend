import { useContext } from 'react';
import toastContext from '../contexts/toastContext';

const useToast = () => useContext(toastContext);
export default useToast;
