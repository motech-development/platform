import { useLocation } from 'react-router-dom';

const useQueryString = () => {
  const { search } = useLocation();

  return new URLSearchParams(search);
};

export default useQueryString;
