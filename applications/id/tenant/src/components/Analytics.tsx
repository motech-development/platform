import React, { FC, memo, ReactNode, useEffect } from 'react';
import { pageview } from 'react-ga';
import { useLocation } from 'react-router-dom';

export interface IAnalyticsProps {
  children: ReactNode;
}

const Analytics: FC<IAnalyticsProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default memo(Analytics);
