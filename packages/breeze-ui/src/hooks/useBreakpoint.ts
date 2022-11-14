import { useEffect, useState } from 'react';
import useWindowSize from './useWindowSize';

const getBreakpoint = () => {
  const lg = window.matchMedia('(min-width: 992px)');
  const md = window.matchMedia('(min-width: 768px)');
  const sm = window.matchMedia('(min-width: 576px)');

  if (lg.matches) {
    return 'lg';
  }

  if (md.matches) {
    return 'md';
  }

  if (sm.matches) {
    return 'sm';
  }

  return 'xs';
};

const useBreakpoint = (): string => {
  const [breakpoint, setBreakpoint] = useState('xs');
  const { width } = useWindowSize();

  useEffect(() => {
    setBreakpoint(getBreakpoint);
  }, [width]);

  return breakpoint;
};

export default useBreakpoint;
