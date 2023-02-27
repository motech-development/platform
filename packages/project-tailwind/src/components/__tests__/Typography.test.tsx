import { ElementType } from 'react';
import { setup, sizing, themes } from '../../utilities/jest';
import { Typography } from '../Typography';

const elements: ElementType[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

const variants = ['body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'lead'] as const;

const alignment = ['centre', 'left', 'right'] as const;

describe('Typography', () => {
  describe.each(elements)('as element "%s"', (element) => {
    describe.each(variants)('with the variant "%s"', (variant) => {
      it('should render the correct output when break word is set', () => {
        const { asFragment } = setup(
          <Typography breakWord as={element} variant={variant}>
            Hello, world
          </Typography>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when truncate is set', () => {
        const { asFragment } = setup(
          <Typography truncate as={element} variant={variant}>
            Hello, world
          </Typography>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it.each(sizing)(
        'should render the correct output when margin is $size',
        ({ size }) => {
          const { asFragment } = setup(
            <Typography as={element} margin={size} variant={variant}>
              Hello, world
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        },
      );

      describe.each(alignment)('with the alignment "%s"', (align) => {
        it('should render the correct output', () => {
          const { asFragment } = setup(
            <Typography as={element} align={align} variant={variant}>
              Hello, world
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });

        it('should render the correct output when rule is set', () => {
          const { asFragment } = setup(
            <Typography rule as={element} align={align} variant={variant}>
              Hello, world
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe.each(themes)('with the theme "$theme"', ({ theme }) => {
        it('should render the correct output', () => {
          const { asFragment } = setup(
            <Typography as={element} theme={theme} variant={variant}>
              Hello, world
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });

        it('should render the correct output when rule is set', () => {
          const { asFragment } = setup(
            <Typography rule as={element} theme={theme} variant={variant}>
              Hello, world
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });
  });
});
