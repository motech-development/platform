import { FC, memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default memo(ScrollToTop);
