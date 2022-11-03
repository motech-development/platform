import reporter from '../ga-web-vitals';

describe('reporter', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (global as any).ga = jest.fn();
  });

  it('should call GA with the correct params when the name is CLS', () => {
    const input = {
      id: 'id',
      name: 'CLS',
      value: 20,
    };

    reporter(input);

    expect(ga).toHaveBeenCalledWith('send', 'event', {
      eventAction: 'CLS',
      eventCategory: 'Web Vitals',
      eventLabel: 'id',
      eventValue: 20000,
      nonInteraction: true,
    });
  });

  it('should call GA with the correct params when the name is not CLS', () => {
    const input = {
      id: 'id',
      name: 'OTHER',
      value: 20,
    };

    reporter(input);

    expect(ga).toHaveBeenCalledWith('send', 'event', {
      eventAction: 'OTHER',
      eventCategory: 'Web Vitals',
      eventLabel: 'id',
      eventValue: 20,
      nonInteraction: true,
    });
  });
});
