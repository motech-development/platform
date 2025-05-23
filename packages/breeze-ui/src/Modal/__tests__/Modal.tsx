import { fireEvent, render, RenderResult } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  let onDismiss: jest.Mock;

  beforeEach(() => {
    onDismiss = jest.fn();
  });

  it('should not show a modal when isOpen is false', () => {
    const { queryByTestId } = render(
      <Modal isOpen={false} title="Title" onDismiss={onDismiss}>
        <p data-testid="content">Content</p>
      </Modal>,
    );

    expect(queryByTestId('content')).not.toBeInTheDocument();
  });

  describe('when open', () => {
    let component: RenderResult;

    describe('when no size set', () => {
      beforeEach(() => {
        component = render(
          <Modal isOpen title="Title" onDismiss={onDismiss}>
            <p data-testid="content">Content</p>
          </Modal>,
        );
      });

      it('should show content', async () => {
        const { findByTestId } = component;

        await expect(findByTestId('content')).resolves.toBeInTheDocument();
      });

      it('should dismiss when pressing the ESC key', () => {
        fireEvent.keyDown(document, {
          code: 27,
          key: 'Escape',
          keyCode: 27,
          which: 27,
        });

        expect(onDismiss).toHaveBeenCalled();
      });

      it('should not dismiss when pressing any other key', () => {
        fireEvent.keyDown(document, {
          code: 13,
          key: 'Enter',
          keyCode: 13,
          which: 13,
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('should dismiss when clicking outside the modal', async () => {
        const { findByRole } = component;
        const outside = await findByRole('dialog');

        fireEvent.click(outside);

        expect(onDismiss).toHaveBeenCalled();
      });

      it('should not dismiss when clicking inside the modal', () => {
        const modal = document.querySelector(
          'div[role="document"] > div',
        ) as Element;

        fireEvent.click(modal);

        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('should add inline style to body', () => {
        const body = document.querySelector('body') as Element;

        expect(body).toHaveAttribute('style', 'overflow: hidden;');
      });
    });

    describe('when size is small', () => {
      beforeEach(() => {
        component = render(
          <Modal isOpen title="Title" size="sm" onDismiss={onDismiss}>
            <p data-testid="content">Content</p>
          </Modal>,
        );
      });

      it('should show content', async () => {
        const { findByTestId } = component;

        await expect(findByTestId('content')).resolves.toBeInTheDocument();
      });

      it('should dismiss when pressing the ESC key', () => {
        fireEvent.keyDown(document, {
          code: 27,
          key: 'Escape',
          keyCode: 27,
          which: 27,
        });

        expect(onDismiss).toHaveBeenCalled();
      });

      it('should not dismiss when pressing any other key', () => {
        fireEvent.keyDown(document, {
          code: 13,
          key: 'Enter',
          keyCode: 13,
          which: 13,
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('should dismiss when clicking outside the modal', async () => {
        const { findByRole } = component;
        const outside = await findByRole('dialog');

        fireEvent.click(outside);

        expect(onDismiss).toHaveBeenCalled();
      });

      it('should not dismiss when clicking inside the modal', () => {
        const modal = document.querySelector(
          'div[role="document"] > div',
        ) as Element;

        fireEvent.click(modal);

        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('should add inline style to body', () => {
        const body = document.querySelector('body') as Element;

        expect(body).toHaveAttribute('style', 'overflow: hidden;');
      });
    });

    describe('when size is large', () => {
      beforeEach(() => {
        component = render(
          <Modal isOpen title="Title" size="lg" onDismiss={onDismiss}>
            <p data-testid="content">Content</p>
          </Modal>,
        );
      });

      it('should show content', async () => {
        const { findByTestId } = component;

        await expect(findByTestId('content')).resolves.toBeInTheDocument();
      });

      it('should dismiss when pressing the ESC key', () => {
        fireEvent.keyDown(document, {
          code: 27,
          key: 'Escape',
          keyCode: 27,
          which: 27,
        });

        expect(onDismiss).toHaveBeenCalled();
      });

      it('should not dismiss when pressing any other key', () => {
        fireEvent.keyDown(document, {
          code: 13,
          key: 'Enter',
          keyCode: 13,
          which: 13,
        });

        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('should dismiss when clicking outside the modal', async () => {
        const { findByRole } = component;
        const outside = await findByRole('dialog');

        fireEvent.click(outside);

        expect(onDismiss).toHaveBeenCalled();
      });

      it('should not dismiss when clicking inside the modal', () => {
        const modal = document.querySelector(
          'div[role="document"] > div',
        ) as Element;

        fireEvent.click(modal);

        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('should add inline style to body', () => {
        const body = document.querySelector('body') as Element;

        expect(body).toHaveAttribute('style', 'overflow: hidden;');
      });
    });
  });
});
