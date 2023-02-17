import { render } from '@testing-library/react';
import { ElementType } from 'react';
import { sizing, themes } from '../../utilities/jest';
import { Button } from '../Button';

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

describe('Button', () => {
  describe.each(elements)('as element "$element"', ({ attrs, element }) => {
    describe.each(themes)('$theme', ({ theme }) => {
      it('should render the correct output when disabled', () => {
        const { asFragment } = render(
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Button disabled as={element} theme={theme} {...attrs}>
            Hello, world
          </Button>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when block element', () => {
        const { asFragment } = render(
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Button block as={element} theme={theme} {...attrs}>
            Hello, world
          </Button>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it.each(sizing)(
        'should render the correct output when size is $size',
        ({ size }) => {
          const { asFragment } = render(
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Button as={element} size={size} theme={theme} {...attrs}>
              Hello, world
            </Button>,
          );

          expect(asFragment()).toMatchSnapshot();
        },
      );
    });
  });
});
