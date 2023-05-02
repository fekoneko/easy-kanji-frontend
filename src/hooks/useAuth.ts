import { useContext } from 'react';
import authContext from '../contexts/authContext';

const useAuth = () => useContext(authContext);
export default useAuth;
