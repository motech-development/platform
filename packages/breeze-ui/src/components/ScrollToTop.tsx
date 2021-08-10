import { FC, useEffect } from 'react';

const ScrollToTop: FC = () => {
  const { pathname } = window.location;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
