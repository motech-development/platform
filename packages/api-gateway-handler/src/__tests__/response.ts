import response from '../response';

describe('response', () => {
  it('should return a JSON response', () => {
    expect(
      response(
        {
          passing: true,
        },
        200,
      ),
    ).toEqual({
      body: JSON.stringify({
        passing: true,
      }),
      statusCode: 200,
    });
  });

  it('should return a string response', () => {
    expect(response('OK', 200)).toEqual({
      body: 'OK',
      statusCode: 200,
    });
  });
});
