import { useContext } from 'react';
import popupContext from '../contexts/popupContext';

const usePopup = () => useContext(popupContext);
export default usePopup;
