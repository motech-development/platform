import { render } from '@testing-library/react';
import { ElementType } from 'react';
import { sizing, themes } from '../../utilities/jest';
import { Link } from '../Link';

const elements = [
  {
    attrs: {
      href: 'https://motech-development.github.io/platform/',
    },
    element: 'a' as ElementType,
  },
  {
    attrs: {
      type: 'button',
    },
    element: 'button' as ElementType,
  },
];

describe('Link', () => {
  describe.each(elements)('as element "$element"', ({ attrs, element }) => {
    describe.each(themes)('$theme', ({ theme }) => {
      it('should render the correct output when disabled', () => {
        const { asFragment } = render(
          <Link disabled as={element} theme={theme} {...attrs}>
            Hello, world
          </Link>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when block element', () => {
        const { asFragment } = render(
          <Link block as={element} theme={theme} {...attrs}>
            Hello, world
          </Link>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it.each(sizing)(
        'should render the correct output when size is $size',
        ({ size }) => {
          const { asFragment } = render(
            <Link as={element} size={size} theme={theme} {...attrs}>
              Hello, world
            </Link>,
          );

          expect(asFragment()).toMatchSnapshot();
        },
      );
    });
  });
});
