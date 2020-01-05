import { useEffect, useState, useRef } from 'react';

const useComponentVisible = (initial: boolean) => {
  const [visible, setVisibility] = useState(initial);
  const ref = useRef(null);

  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setVisibility(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return {
    ref,
    setVisibility,
    visible,
  };
};

export default useComponentVisible;
