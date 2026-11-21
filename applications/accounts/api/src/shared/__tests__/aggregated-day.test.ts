import aggregatedDay from '../aggregated-day';

describe('aggregated-day', () => {
  it('should return the correct date', () => {
    expect(aggregatedDay('2020-04-28T20:29:21Z')).toEqual(
      '2020-04-28T00:00:00.000Z',
    );
  });
});
