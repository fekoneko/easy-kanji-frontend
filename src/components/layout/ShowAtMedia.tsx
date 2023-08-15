import { ReactNode, useState } from 'react';
import useWindowEventListener from '../../hooks/useWindowEventListener';

type Media = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const MEDIA_WIDTH_MAP = { xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };

type ShowAtMediaProps = {
  min?: Media | number;
  max?: Media | number;
  children?: ReactNode;
};

const ShowAtMedia = ({ min, max, children }: ShowAtMediaProps) => {
  const [width, setWidth] = useState(window.innerWidth);

  useWindowEventListener('resize', () => {
    setWidth(window.innerWidth);
  });

  if (
    (min === undefined || width >= (typeof min === 'string' ? MEDIA_WIDTH_MAP[min] : min)) &&
    (max === undefined || width < (typeof max === 'string' ? MEDIA_WIDTH_MAP[max] : max))
  )
    return <>{children}</>;
  else return <></>;
};
export default ShowAtMedia;
