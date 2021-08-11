import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { FC, useState } from 'react';
import useOutsideClick from '../useOutsideClick';

const TestComponent: FC = () => {
  const [show, setShow] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useOutsideClick(ref, () => {
    setShow(false);
  });

  return (
    <main data-testid="body">
      <button type="button" data-testid="button" onClick={() => setShow(true)}>
        Show
      </button>

      {show && (
        <div ref={setRef} data-testid="element">
          Element
        </div>
      )}
    </main>
  );
};

describe('useOutsideClick', () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(<TestComponent />);
  });

  describe('mouseDown', () => {
    it('should hide element when you click outside', async () => {
      const { findByTestId, queryByTestId } = component;

      await act(async () => {
        const button = await findByTestId('button');

        fireEvent.click(button);
      });

      await expect(findByTestId('element')).resolves.toBeInTheDocument();

      await act(async () => {
        const body = await findByTestId('body');

        fireEvent.mouseDown(body);
      });

      expect(queryByTestId('element')).not.toBeInTheDocument();
    });

    it('should not hide element when you click inside', async () => {
      const { findByTestId } = component;

      await act(async () => {
        const button = await findByTestId('button');

        fireEvent.click(button);
      });

      await expect(findByTestId('element')).resolves.toBeInTheDocument();

      await act(async () => {
        const element = await findByTestId('element');

        fireEvent.mouseDown(element);
      });

      await expect(findByTestId('element')).resolves.toBeInTheDocument();
    });
  });

  describe('touchStart', () => {
    it('should hide element when you click outside', async () => {
      const { findByTestId, queryByTestId } = component;

      await act(async () => {
        const button = await findByTestId('button');

        fireEvent.click(button);
      });

      await expect(findByTestId('element')).resolves.toBeInTheDocument();

      await act(async () => {
        const body = await findByTestId('body');

        fireEvent.touchStart(body);
      });

      expect(queryByTestId('element')).not.toBeInTheDocument();
    });

    it('should not hide element when you click inside', async () => {
      const { findByTestId } = component;

      await act(async () => {
        const button = await findByTestId('button');

        fireEvent.click(button);
      });

      await expect(findByTestId('element')).resolves.toBeInTheDocument();

      await act(async () => {
        const element = await findByTestId('element');

        fireEvent.touchStart(element);
      });

      await expect(findByTestId('element')).resolves.toBeInTheDocument();
    });
  });
});
