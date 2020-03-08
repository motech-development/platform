import { useEffect, useState } from 'react';

const useWindowSize = () => {
  const isClient = typeof window === 'object';
  const getWindowSize = () => ({
    height: isClient ? window.innerHeight : undefined,
    width: isClient ? window.innerWidth : undefined,
  });
  const [windowSize, setWindowSize] = useState(getWindowSize);
  const handleResize = () => {
    setWindowSize(getWindowSize());
  };

  useEffect(() => {
    if (isClient) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (isClient) {
        window.removeEventListener('resize', handleResize);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
};

export default useWindowSize;
