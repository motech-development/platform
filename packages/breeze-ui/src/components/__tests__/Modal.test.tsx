import { render, RenderResult, waitFor } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  let onDismiss: jest.Mock;

  beforeEach(() => {
    onDismiss = jest.fn();
  });

  it('should not show a modal when isOpen is false', () => {
    const { queryByTestId } = render(
      <Modal
        content={<p data-testid="content">Content</p>}
        footer={<button type="button">Close</button>}
        isOpen={false}
        title="Title"
        onDismiss={onDismiss}
      />,
    );

    expect(queryByTestId('content')).not.toBeInTheDocument();
  });

  describe('when open', () => {
    let component: RenderResult;

    beforeEach(() => {
      component = render(
        <Modal
          isOpen
          content={<p data-testid="content">Content</p>}
          footer={<button type="button">Close</button>}
          title="Title"
          onDismiss={onDismiss}
        />,
      );
    });

    it('should show content', async () => {
      const { getByRole } = component;

      const dialog = await waitFor(() => getByRole('dialog'));

      expect(dialog).toMatchSnapshot();
    });
  });
});
