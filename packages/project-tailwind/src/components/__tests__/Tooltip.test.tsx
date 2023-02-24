import { Side } from '@floating-ui/react';
import { fireEvent, render } from '@testing-library/react';
import { mockViewport } from 'jsdom-testing-mocks';
import { ReactNode } from 'react';
import { act } from 'react-dom/test-utils';
import { themes } from '../../utilities/jest';
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
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should hide tooltip after 1000ms', async () => {
      const { asFragment, findByTestId } = render(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            content={<p>Hello, world</p>}
          />
        </Wrapper>,
      );

      const firstRender = asFragment();

      await act(async () => {
        const parent = await findByTestId('tooltip-parent-element');

        fireEvent.mouseEnter(parent);

        fireEvent.mouseLeave(parent);
      });

      act(() => jest.advanceTimersByTime(900));

      expect(firstRender).toMatchDiffSnapshot(asFragment());

      act(() => jest.advanceTimersByTime(100));

      expect(firstRender).toEqual(asFragment());
    });

    it('should hide after set time', async () => {
      const { asFragment, findByTestId } = render(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            content={<p>Hello, world</p>}
            time={400}
          />
        </Wrapper>,
      );

      const firstRender = asFragment();

      await act(async () => {
        const parent = await findByTestId('tooltip-parent-element');

        fireEvent.mouseEnter(parent);

        fireEvent.mouseLeave(parent);
      });

      act(() => jest.advanceTimersByTime(300));

      expect(firstRender).toMatchDiffSnapshot(asFragment());

      act(() => jest.advanceTimersByTime(100));

      expect(firstRender).toEqual(asFragment());
    });
  });

  describe.each(placements)('when position is "%s"', (position) => {
    it('should correctly render component when parent is not hovered over', () => {
      const { asFragment } = render(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            content={<p>Hello, world</p>}
            position={position}
          />
        </Wrapper>,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should correctly render component when parent is hovered over', async () => {
      const { asFragment, findByTestId } = render(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            content={<p>Hello, world</p>}
            position={position}
          />
        </Wrapper>,
      );

      const firstRender = asFragment();

      await act(async () => {
        const parent = await findByTestId('tooltip-parent-element');

        fireEvent.mouseEnter(parent);
      });

      expect(firstRender).toMatchDiffSnapshot(asFragment());
    });
  });

  describe.each(themes)('when theme is "$theme"', ({ theme }) => {
    it('should correctly render component when parent is not hovered over', () => {
      const { asFragment } = render(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            content={<p>Hello, world</p>}
            theme={theme}
          />
        </Wrapper>,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should correctly render component when parent is hovered over', async () => {
      const { asFragment, findByTestId } = render(
        <Wrapper>
          <Tooltip
            parent={
              <button data-testid="button" type="button">
                Hover over me
              </button>
            }
            content={<p>Hello, world</p>}
            theme={theme}
          />
        </Wrapper>,
      );

      const firstRender = asFragment();

      await act(async () => {
        const parent = await findByTestId('tooltip-parent-element');

        fireEvent.mouseEnter(parent);
      });

      expect(firstRender).toMatchDiffSnapshot(asFragment());
    });
  });
});
