import { setup, themes } from '../../utilities/jest';
import { Toolbar } from '../Toolbar';

const elements = [
  {
    asChild: false,
    element: 'div',
    render: <p>Hello, world</p>,
  },
  {
    asChild: true,
    element: 'header',
    render: (
      <header>
        <p>Hello, world</p>
      </header>
    ),
  },
];

describe('Toolbar', () => {
  describe.each(elements)('as element "$element"', ({ asChild, render }) => {
    describe.each(themes)('when theme is "$theme"', ({ theme }) => {
      it('should correctly render componenet', () => {
        const { asFragment } = setup(
          <Toolbar asChild={asChild} theme={theme}>
            {render}
          </Toolbar>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should correctly render componenet when border is set', () => {
        const { asFragment } = setup(
          <Toolbar asChild={asChild} border theme={theme}>
            {render}
          </Toolbar>,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should correctly render componenet when position is fixed', () => {
        const { asFragment } = setup(
          <Toolbar asChild={asChild} fixed theme={theme}>
            {render}
          </Toolbar>,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
