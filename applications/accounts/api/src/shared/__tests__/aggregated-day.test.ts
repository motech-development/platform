import aggregatedDay from '../aggregated-day';

describe('aggregated-day', () => {
  it('should return the correct date', () => {
    expect(aggregatedDay('2020-04-28T20:29:21Z')).toEqual(
      '2020-04-28T00:00:00.000Z',
    );
  });

  it('should round a pre-1970 date down to the start of its day', () => {
    expect(aggregatedDay('1969-12-31T12:00:00Z')).toEqual(
      '1969-12-31T00:00:00.000Z',
    );
  });
});
