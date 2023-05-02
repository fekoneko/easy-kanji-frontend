import { ReactNode } from 'react';
import { Role } from '../../contexts/authContext';
import useAuth from '../../hooks/useAuth';

type ProtectedContentProps = {
  allowedRoles?: Role[];
  placeholder?: ReactNode;
  children?: ReactNode;
};

const ProtectedContent = ({ allowedRoles, placeholder, children }: ProtectedContentProps) => {
  const { auth } = useAuth();

  if (
    auth &&
    (!allowedRoles || allowedRoles.some((allowedRole) => auth.roles.includes(allowedRole)))
  ) {
    return <>{children}</>;
  } else return <>{placeholder}</>;
};
export default ProtectedContent;
