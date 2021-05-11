import { renderHook } from '@testing-library/react-hooks';
import useQs from '../useQs';

describe('useQs', () => {
  it('should generate the correct string params', () => {
    const { result } = renderHook(() => useQs());

    expect(
      result.current.stringify({
        boolean: true,
        number: 100,
        string: 'String',
      }),
    ).toEqual('boolean=true&number=100&string=String');
  });

  it('should parse the query string', () => {
    const { result } = renderHook(() => useQs());

    expect(
      result.current.parse('boolean=true&number=100&string=String'),
    ).toEqual({
      boolean: true,
      number: 100,
      string: 'String',
    });
  });
});
