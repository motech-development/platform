import paramCheck from '../param-check';

describe('param-check', () => {
  let value: string;

  it('should throw an error response if value does not exist', () => {
    expect(() => {
      paramCheck(value, 'This does not exist', 400);
    }).toThrow();
  });

  it('should return the value if it exists', () => {
    value = 'Exists!';

    expect(paramCheck(value, 'This does not exist', 400)).toEqual('Exists!');
  });
});
