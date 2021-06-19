import { FC, ReactNode, useEffect, useRef } from 'react';
import { disableBodyScroll } from 'body-scroll-lock';

export interface IWrapperProps {
  children: ReactNode;
}

const Wrapper: FC<IWrapperProps> = ({ children }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // istanbul ignore next
    if (parentRef.current) {
      disableBodyScroll(parentRef.current);
    }
  }, []);

  return <div ref={parentRef}>{children}</div>;
};

export default Wrapper;
