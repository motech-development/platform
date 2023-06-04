import { ElementType } from 'react';
import { setup, sizing, themes } from '../../utilities/jest';
import { Box } from '../Box';
import { Typography } from '../Typography';

const elements: ElementType[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

const variants = ['body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'lead'] as const;

const alignment = ['centre', 'left', 'right'] as const;

describe('Typography', () => {
  describe.each(elements)('as element "%s"', (element) => {
    describe.each(variants)('with the variant "%s"', (variant) => {
      it('should render the correct output when break word is set', () => {
        const { asFragment } = setup(
          <Typography asChild breakWord variant={variant}>
            <Box as={element}>Hello, world</Box>
          </Typography>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when truncate is set', () => {
        const { asFragment } = setup(
          <Typography asChild truncate variant={variant}>
            <Box as={element}>Hello, world</Box>
          </Typography>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it.each(sizing)(
        'should render the correct output when margin is $size',
        ({ size }) => {
          const { asFragment } = setup(
            <Typography asChild margin={size} variant={variant}>
              <Box as={element}>Hello, world</Box>
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        },
      );

      describe.each(alignment)('with the alignment "%s"', (align) => {
        it('should render the correct output', () => {
          const { asFragment } = setup(
            <Typography asChild align={align} variant={variant}>
              <Box as={element}>Hello, world</Box>
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });

        it('should render the correct output when rule is set', () => {
          const { asFragment } = setup(
            <Typography asChild rule align={align} variant={variant}>
              <Box as={element}>Hello, world</Box>
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe.each(themes)('with the theme "$theme"', ({ theme }) => {
        it('should render the correct output', () => {
          const { asFragment } = setup(
            <Typography asChild theme={theme} variant={variant}>
              <Box as={element}>Hello, world</Box>
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });

        it('should render the correct output when rule is set', () => {
          const { asFragment } = setup(
            <Typography asChild rule theme={theme} variant={variant}>
              <Box as={element}>Hello, world</Box>
            </Typography>,
          );

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });
  });
});
