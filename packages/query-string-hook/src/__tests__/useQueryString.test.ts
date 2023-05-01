import { renderHook } from '@testing-library/react';
import useQueryString from '../useQueryString';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    search: {
      test: 'hello',
    },
  }),
}));

describe('useQueryString', () => {
  it('should return value from query string', () => {
    const { result } = renderHook(() => useQueryString());

    expect(result.current.get('test')).toEqual('hello');
  });
});
