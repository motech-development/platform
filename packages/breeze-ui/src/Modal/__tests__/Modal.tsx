import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import Modal from '../Modal';

describe('Modal', () => {
  let onDismiss: jest.Mock;

  beforeEach(() => {
    onDismiss = jest.fn();
  });

  it('should not show a modal when isOpen is false', () => {
    const { queryByTestId } = render(
      <Modal isOpen={false} onDismiss={onDismiss}>
        <p data-testid="content">Content</p>
      </Modal>,
    );

    expect(queryByTestId('content')).not.toBeInTheDocument();
  });

  describe('when open', () => {
    let component: RenderResult;

    beforeEach(() => {
      component = render(
        <Modal isOpen onDismiss={onDismiss}>
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
  });
});
