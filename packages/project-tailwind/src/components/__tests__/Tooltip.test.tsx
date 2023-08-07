import { Side } from '@floating-ui/react';
import { mockViewport } from 'jsdom-testing-mocks';
import { ReactNode } from 'react';
import { act } from 'react-dom/test-utils';
import { setup, themes } from '../../utilities/jest';
import { Tooltip } from '../Tooltip';

interface IWrapperProps {
  children: ReactNode;
}
function Wrapper({ children }: IWrapperProps) {
  const styles = {
    alignItems: 'center',
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
  };

  return <div style={styles}>{children}</div>;
}

const placements: Side[] = ['top', 'bottom', 'right', 'left'];

describe('Tooltip', () => {
  beforeAll(() => {
    mockViewport({
      height: '768px',
      width: '1024px',
    });
  });

  describe('timer', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should hide tooltip after 1000ms', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
          >
            <p>Hello, world</p>
          </Tooltip>
        </Wrapper>,
      );

      const firstRender = asFragment();

      await act(async () => {
        const parent = getByTestId('tooltip-parent-element');

        await user.hover(parent);

        await user.unhover(parent);
      });

      act(() => jest.advanceTimersByTime(900));

      expect(firstRender).toMatchDiffSnapshot(asFragment());

      act(() => jest.advanceTimersByTime(100));

      expect(firstRender).toEqual(asFragment());
    });

    it('should hide after set time', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            time={400}
          >
            <p>Hello, world</p>
          </Tooltip>
        </Wrapper>,
      );

      const firstRender = asFragment();

      await act(async () => {
        const parent = getByTestId('tooltip-parent-element');

        await user.hover(parent);

        await user.unhover(parent);
      });

      act(() => jest.advanceTimersByTime(300));

      expect(firstRender).toMatchDiffSnapshot(asFragment());

      act(() => jest.advanceTimersByTime(100));

      expect(firstRender).toEqual(asFragment());
    });
  });

  describe.each(placements)('when position is "%s"', (position) => {
    it('should correctly render component when parent is not hovered over', () => {
      const { asFragment } = setup(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            position={position}
          >
            <p>Hello, world</p>
          </Tooltip>
        </Wrapper>,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should correctly render component when parent is hovered over', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            position={position}
          >
            <p>Hello, world</p>
          </Tooltip>
        </Wrapper>,
      );

      const firstRender = asFragment();

      await act(async () => {
        const parent = getByTestId('tooltip-parent-element');

        await user.hover(parent);
      });

      expect(firstRender).toMatchDiffSnapshot(asFragment());
    });
  });

  describe.each(themes)('when theme is "$theme"', ({ theme }) => {
    it('should correctly render component when parent is not hovered over', () => {
      const { asFragment } = setup(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            theme={theme}
          >
            <p>Hello, world</p>
          </Tooltip>
        </Wrapper>,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should correctly render component when parent is hovered over', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            theme={theme}
          >
            <p>Hello, world</p>
          </Tooltip>
        </Wrapper>,
      );

      const firstRender = asFragment();

      await act(async () => {
        const parent = getByTestId('tooltip-parent-element');

        await user.hover(parent);
      });

      expect(firstRender).toMatchDiffSnapshot(asFragment());
    });
  });
});
