import { act, fireEvent, render } from '@testing-library/react';
import Alert from '../Alert';

describe('Alert', () => {
  let onDismiss: jest.Mock;

  beforeEach(() => {
    onDismiss = jest.fn();
  });

  describe('spacing', () => {
    it('should have the correct spacing by default', () => {
      const { container } = render(<Alert message="Hello world" />);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have no spacing', () => {
      const { container } = render(
        <Alert message="Hello world" spacing="none" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct small spacing', () => {
      const { container } = render(
        <Alert message="Hello world" spacing="sm" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct medium spacing', () => {
      const { container } = render(
        <Alert message="Hello world" spacing="md" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct large spacing', () => {
      const { container } = render(
        <Alert message="Hello world" spacing="lg" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('theming', () => {
    it('should have the correct colours by default', () => {
      const { container } = render(<Alert message="Hello world" />);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct colours by for primary', () => {
      const { container } = render(
        <Alert message="Hello world" colour="primary" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct colours by for secondary', () => {
      const { container } = render(
        <Alert message="Hello world" colour="secondary" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct colours by for danger', () => {
      const { container } = render(
        <Alert message="Hello world" colour="danger" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct colours by for success', () => {
      const { container } = render(
        <Alert message="Hello world" colour="success" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct colours by for warning', () => {
      const { container } = render(
        <Alert message="Hello world" colour="warning" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('should display the correct message', async () => {
    const { findByText } = render(<Alert message="Hello world" />);

    await expect(findByText('Hello world')).resolves.toBeDefined();
  });

  it('should display the an icon if one is set', async () => {
    const { findByTestId } = render(
      <Alert message="Hello world" icon={<div data-testid="icon" />} />,
    );

    await expect(findByTestId('icon')).resolves.toBeDefined();
  });

  it('should display the dismiss button if dismissable', async () => {
    const { findByTestId } = render(
      <Alert dismissable message="Hello world" />,
    );

    await expect(findByTestId('alert-dismiss-text')).resolves.toHaveTextContent(
      'Dismiss',
    );
  });

  it('should display the correct dismissable text', async () => {
    const { findByTestId } = render(
      <Alert dismissable dismissText="Close me" message="Hello world" />,
    );

    await expect(findByTestId('alert-dismiss-text')).resolves.toHaveTextContent(
      'Close me',
    );
  });

  it('should call onDismiss when one is set', async () => {
    const { findByTestId } = render(
      <Alert dismissable message="Hello world" onDismiss={onDismiss} />,
    );
    const dismiss = await findByTestId('alert-dismiss-text');

    fireEvent.click(dismiss);

    expect(onDismiss).toHaveBeenCalled();
  });

  it('should auto dismiss if a time is set', async () => {
    jest.useFakeTimers();

    const { queryByRole } = render(
      <Alert dismissable={5000} message="Hello world" />,
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should not be displayed when dismissed', async () => {
    const { findByTestId, queryByRole } = render(
      <Alert dismissable message="Hello world" />,
    );
    const dismiss = await findByTestId('alert-dismiss-text');

    fireEvent.click(dismiss);

    expect(queryByRole('alert')).not.toBeInTheDocument();
  });
});
