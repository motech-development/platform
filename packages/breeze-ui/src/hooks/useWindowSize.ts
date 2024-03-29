import { useEffect, useState } from 'react';

interface IUseWindowSize {
  height: number;
  width: number;
}

const useWindowSize = (): IUseWindowSize => {
  const getWindowSize = () => ({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const [windowSize, setWindowSize] = useState(getWindowSize);
  const handleResize = () => {
    setWindowSize(getWindowSize);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
};

export default useWindowSize;
