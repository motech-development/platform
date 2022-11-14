import { useLocation } from 'react-router-dom';

const useQueryString = (): URLSearchParams => {
  const { search } = useLocation();

  return new URLSearchParams(search);
};

export default useQueryString;
