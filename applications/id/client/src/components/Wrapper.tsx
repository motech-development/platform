import { disableBodyScroll } from 'body-scroll-lock';
import { ReactNode, useEffect, useRef } from 'react';

export interface IWrapperProps {
  children: ReactNode;
}

function Wrapper({ children }: IWrapperProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // istanbul ignore next
    if (parentRef.current) {
      disableBodyScroll(parentRef.current);
    }
  }, []);

  return <div ref={parentRef}>{children}</div>;
}

export default Wrapper;
