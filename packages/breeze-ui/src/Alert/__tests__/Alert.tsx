import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import Alert from '../Alert';

describe('Alert', () => {
  let onDismiss: jest.Mock;

  beforeEach(() => {
    onDismiss = jest.fn();
  });

  describe('spacing', () => {
    it('should have the correct spacing by default', () => {
      const { container } = render(<Alert message="Hello world" />);

      expect(container.firstChild).toHaveStyle('margin-bottom: 10px;');
    });

    it('should have the correct small spacing', () => {
      const { container } = render(
        <Alert message="Hello world" spacing="sm" />,
      );

      expect(container.firstChild).toHaveStyle('margin-bottom: 5px;');
    });

    it('should have the correct medium spacing', () => {
      const { container } = render(
        <Alert message="Hello world" spacing="md" />,
      );

      expect(container.firstChild).toHaveStyle('margin-bottom: 10px;');
    });

    it('should have the correct large spacing', () => {
      const { container } = render(
        <Alert message="Hello world" spacing="lg" />,
      );

      expect(container.firstChild).toHaveStyle('margin-bottom: 20px;');
    });
  });

  describe('theming', () => {
    it('should have the correct colours by default', () => {
      const { container } = render(<Alert message="Hello world" />);

      expect(container.firstChild).toHaveStyle(`
        background-color: #2e9dc8;
        color: #fff;
      `);
    });

    it('should have the correct colours by for primary', () => {
      const { container } = render(
        <Alert message="Hello world" colour="primary" />,
      );

      expect(container.firstChild).toHaveStyle(`
        background-color: #2e9dc8;
        color: #fff;
      `);
    });

    it('should have the correct colours by for secondary', () => {
      const { container } = render(
        <Alert message="Hello world" colour="secondary" />,
      );

      expect(container.firstChild).toHaveStyle(`
        background-color: #f6f9fc;
        color: #333;
      `);
    });

    it('should have the correct colours by for danger', () => {
      const { container } = render(
        <Alert message="Hello world" colour="danger" />,
      );

      expect(container.firstChild).toHaveStyle(`
        background-color: rgb(199,56,79);
        color: #fff;
      `);
    });

    it('should have the correct colours by for success', () => {
      const { container } = render(
        <Alert message="Hello world" colour="success" />,
      );

      expect(container.firstChild).toHaveStyle(`
        background-color: rgb(0,128,93);
        color: #fff;
      `);
    });
  });

  it('should display the correct message', async () => {
    const { findByText } = render(<Alert message="Hello world" />);

    await expect(findByText('Hello world')).resolves.toBeDefined();
  });

  it('should display the an icon if one is set', () => {
    const { findByTestId } = render(
      <Alert message="Hello world" icon={() => <div data-testid="icon" />} />,
    );

    expect(findByTestId('icon')).toBeDefined();
  });

  it('should display the dismiss button if dismissable', async () => {
    const { findByLabelText } = render(
      <Alert dismissable message="Hello world" />,
    );

    await expect(findByLabelText('Dismiss')).resolves.toBeDefined();
  });

  it('should call onDismiss when one is set', async () => {
    const { findByLabelText } = render(
      <Alert dismissable message="Hello world" onDismiss={onDismiss} />,
    );
    const dismiss = await findByLabelText('Dismiss');

    fireEvent.click(dismiss);

    expect(onDismiss).toHaveBeenCalled();
  });

  it('should auto dismiss if a time is set', async () => {
    jest.useFakeTimers();

    const { queryByRole } = render(
      <Alert dismissable={5000} message="Hello world" />,
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(queryByRole('alert')).toBeNull();
  });

  it('should not be displayed when dismissed', async () => {
    const { findByLabelText, queryByRole } = render(
      <Alert dismissable message="Hello world" />,
    );
    const dismiss = await findByLabelText('Dismiss');

    fireEvent.click(dismiss);

    expect(queryByRole('alert')).toBeNull();
  });
});
