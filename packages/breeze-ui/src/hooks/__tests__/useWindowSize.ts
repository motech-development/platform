import { renderHook } from '@testing-library/react-hooks';
import useWindowSize from '../useWindowSize';

describe('useWindowSize', () => {
  it('should return the current window width and height', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({
      height: 768,
      width: 1024,
    });
  });

  it('should return the window width and height after window resize', () => {
    Object.assign(window, {
      innerHeight: 1000,
    });
    Object.assign(window, {
      innerWidth: 1000,
    });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({
      height: 1000,
      width: 1000,
    });
  });
});
