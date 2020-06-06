import { renderHook } from '@testing-library/react-hooks';
import useQuery from '../useQuery';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    search: {
      test: 'hello',
    },
  }),
}));

describe('useQuery', () => {
  it('should return value from query string', () => {
    const { result } = renderHook(() => useQuery());

    expect(result.current.get('test')).toEqual('hello');
  });
});
