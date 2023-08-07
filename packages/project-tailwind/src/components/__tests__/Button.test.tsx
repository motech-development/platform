import { setup, sizing, themes } from '../../utilities/jest';
import { Button } from '../Button';

const elements = [
  {
    asChild: true,
    element: 'a',
    render: (
      <a href="https://motech-development.github.io/platform/">Hello, world</a>
    ),
  },
  {
    asChild: false,
    attrs: {
      type: 'button',
    } as const,
    element: 'button',
    render: <>Hello, world</>,
  },
];

describe('Button', () => {
  describe.each(elements)(
    'as element "$element"',
    ({ asChild, attrs, render }) => {
      describe.each(themes)('$theme', ({ theme }) => {
        it('should render the correct output when disabled', () => {
          const { asFragment } = setup(
            <Button asChild={asChild} disabled theme={theme} {...attrs}>
              {render}
            </Button>,
          );

          expect(asFragment()).toMatchSnapshot();
        });

        it('should render the correct output when block element', () => {
          const { asFragment } = setup(
            <Button asChild={asChild} block theme={theme} {...attrs}>
              {render}
            </Button>,
          );

          expect(asFragment()).toMatchSnapshot();
        });

        it.each(sizing)(
          'should render the correct output when size is $size',
          ({ size }) => {
            const { asFragment } = setup(
              <Button asChild={asChild} size={size} theme={theme} {...attrs}>
                {render}
              </Button>,
            );

            expect(asFragment()).toMatchSnapshot();
          },
        );
      });
    },
  );
});
