import { useTailwind } from '../tailwind';

describe('tailwind', () => {
  it('should return the correct styles', () => {
    const { createStyles } = useTailwind('primary', 'md');

    expect(
      createStyles({
        classNames: ['text-sm', 'font-medium'],
        sizing: {
          md: ['md-4'],
          none: ['md-0'],
        },
        theme: {
          primary: ['bg-blue-50'],
          warning: ['bg-yellow-50'],
        },
      }),
    ).toMatchSnapshot();
  });

  it('should throw an error if theme is not defined', () => {
    const { createStyles } = useTailwind('danger', 'md');

    expect(() => {
      createStyles({
        classNames: ['text-sm', 'font-medium'],
        sizing: {
          md: ['md-4'],
          none: ['md-0'],
        },
        theme: {
          primary: ['bg-blue-50'],
          warning: ['bg-yellow-50'],
        },
      });
    }).toThrow('No classes defined for this theme.');
  });

  it('should throw an error if sizing is not defined', () => {
    const { createStyles } = useTailwind('primary', 'sm');

    expect(() => {
      createStyles({
        classNames: ['text-sm', 'font-medium'],
        sizing: {
          md: ['md-4'],
          none: ['md-0'],
        },
        theme: {
          primary: ['bg-blue-50'],
          warning: ['bg-yellow-50'],
        },
      });
    }).toThrow('No classes defined for this sizing.');
  });

  it('should omit universal classes if none are passed', () => {
    const { createStyles } = useTailwind('primary', 'md');

    expect(
      createStyles({
        sizing: {
          md: ['md-4'],
          none: ['md-0'],
        },
        theme: {
          primary: ['bg-blue-50'],
          warning: ['bg-yellow-50'],
        },
      }),
    ).toMatchSnapshot();
  });

  it('should omit theme styles if none are passed', () => {
    const { createStyles } = useTailwind('primary', 'md');

    expect(
      createStyles({
        classNames: ['text-sm', 'font-medium'],
        sizing: {
          md: ['md-4'],
          none: ['md-0'],
        },
      }),
    ).toMatchSnapshot();
  });

  it('should omit sizing styles if none are passed', () => {
    const { createStyles } = useTailwind('primary', 'md');

    expect(
      createStyles({
        classNames: ['text-sm', 'font-medium'],
        theme: {
          primary: ['bg-blue-50'],
          warning: ['bg-yellow-50'],
        },
      }),
    ).toMatchSnapshot();
  });
});
