import { setup, sizing, themes } from '../../utilities/jest';
import { Typography } from '../Typography';

const elements = [
  {
    asChild: true,
    element: 'h1',
    render: <h1>Hello, world</h1>,
  },
  {
    asChild: true,
    element: 'h2',
    render: <h2>Hello, world</h2>,
  },
  {
    asChild: true,
    element: 'h3',
    render: <h3>Hello, world</h3>,
  },
  {
    asChild: true,
    element: 'h4',
    render: <h4>Hello, world</h4>,
  },
  {
    asChild: true,
    element: 'h5',
    render: <h5>Hello, world</h5>,
  },
  {
    asChild: true,
    element: 'h6',
    render: <h6>Hello, world</h6>,
  },
  {
    asChild: false,
    element: 'p',
    render: <>Hello, world</>,
  },
];

const variants = ['body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'lead'] as const;

const alignment = ['centre', 'left', 'right'] as const;

describe('Typography', () => {
  describe.each(elements)('as element "$element"', ({ asChild, render }) => {
    describe.each(variants)('with the variant "%s"', (variant) => {
      it('should render the correct output when break word is set', () => {
        const { asFragment } = setup(
          <Typography breakWord asChild={asChild} variant={variant}>
            {render}
          </Typography>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when truncate is set', () => {
        const { asFragment } = setup(
          <Typography truncate asChild={asChild} variant={variant}>
            {render}
          </Typography>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it.each(sizing)(
        'should render the correct output when margin is $size',
        ({ size }) => {
          const { asFragment } = setup(
            <Typography asChild={asChild} margin={size} variant={variant}>
              {render}
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        },
      );

      describe.each(alignment)('with the alignment "%s"', (align) => {
        it('should render the correct output', () => {
          const { asFragment } = setup(
            <Typography asChild={asChild} align={align} variant={variant}>
              {render}
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });

        it('should render the correct output when rule is set', () => {
          const { asFragment } = setup(
            <Typography rule asChild={asChild} align={align} variant={variant}>
              {render}
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe.each(themes)('with the theme "$theme"', ({ theme }) => {
        it('should render the correct output', () => {
          const { asFragment } = setup(
            <Typography asChild={asChild} theme={theme} variant={variant}>
              {render}
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });

        it('should render the correct output when rule is set', () => {
          const { asFragment } = setup(
            <Typography asChild={asChild} rule theme={theme} variant={variant}>
              {render}
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });
  });
});
