import { setup, sizing, themes } from '../../utilities/jest';
import { Link } from '../Link';

const elements = [
  {
    asChild: false,
    attrs: {
      href: 'https://motech-development.github.io/platform/',
    } as const,
    element: 'a',
    render: <>Hello, world</>,
  },
  {
    asChild: true,
    element: 'button',
    render: <button type="button">Hello, world</button>,
  },
];

describe('Link', () => {
  describe.each(elements)(
    'as element "$element"',
    ({ asChild, attrs, render }) => {
      describe.each(themes)('$theme', ({ theme }) => {
        it('should render the correct output when block element', () => {
          const { asFragment } = setup(
            <Link asChild={asChild} block theme={theme} {...attrs}>
              {render}
            </Link>,
          );

          expect(asFragment()).toMatchSnapshot();
        });

        it.each(sizing)(
          'should render the correct output when size is $size',
          ({ size }) => {
            const { asFragment } = setup(
              <Link asChild={asChild} size={size} theme={theme} {...attrs}>
                {render}
              </Link>,
            );

            expect(asFragment()).toMatchSnapshot();
          },
        );
      });
    },
  );
});
