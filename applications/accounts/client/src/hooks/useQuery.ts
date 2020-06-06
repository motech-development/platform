import { useLocation } from 'react-router-dom';

const useQuery = () => {
  const { search } = useLocation();

  return new URLSearchParams(search);
};

export default useQuery;
