import { useEffect } from 'react';
import { To, useNavigate } from 'react-router-dom';

type NavigateOnceProps = {
  to: To;
};

const NavigateOnce = ({ to }: NavigateOnceProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to);
  }, []);

  return null;
};
export default NavigateOnce;
