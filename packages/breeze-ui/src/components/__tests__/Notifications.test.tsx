import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import TableCell from '../TableCell';
import Notifications from '../Notifications';

describe('Notifications', () => {
  let items: string[];
  let label: string;
  let noResults: ReactNode;
  let row: (item: string) => ReactNode;
  let onClose: jest.Mock;

  beforeEach(() => {
    items = ['Alert 1', 'Alert 2'];
    label = 'Notifications';
    noResults = <div>No results</div>;
    row = (item) => <TableCell>{item}</TableCell>;
    onClose = jest.fn();
  });

  it('should show an alert notification', () => {
    const { container } = render(
      <Notifications
        alert
        items={items}
        label={label}
        noResults={noResults}
        row={row}
        onClose={onClose}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should not show an alert notification', () => {
    const { container } = render(
      <Notifications
        alert={false}
        items={items}
        label={label}
        noResults={noResults}
        row={row}
        onClose={onClose}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should display notifications when you click the alert button', async () => {
    const { container, findByRole } = render(
      <Notifications
        alert
        items={items}
        label={label}
        noResults={noResults}
        row={row}
        onClose={onClose}
      />,
    );

    await act(async () => {
      const button = await findByRole('button');

      fireEvent.click(button);
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should hide the notifications if you click elsewhere', async () => {
    const { container, findByRole, queryByRole } = render(
      <div>
        <Notifications
          alert
          items={items}
          label={label}
          noResults={noResults}
          placement="bottom-start"
          row={row}
          onClose={onClose}
        />
      </div>,
    );

    await act(async () => {
      const button = await findByRole('button');

      fireEvent.click(button);
    });

    await expect(findByRole('table')).resolves.toBeInTheDocument();

    act(() => {
      const body = container.firstChild as ChildNode;

      fireEvent.mouseDown(body);
    });

    expect(queryByRole('table')).not.toBeInTheDocument();
  });

  it('should display the label', async () => {
    const { findByRole, findAllByText } = render(
      <Notifications
        alert
        items={items}
        label={label}
        noResults={noResults}
        row={row}
        onClose={onClose}
      />,
    );
    const button = await findByRole('button');

    expect(button).toHaveTextContent('Notifications');

    fireEvent.click(button);

    await waitFor(() =>
      expect(findAllByText('Notifications')).resolves.toHaveLength(2),
    );
  });

  it('should call onClose when closed', async () => {
    const { findByRole } = render(
      <Notifications
        alert
        items={items}
        label={label}
        noResults={noResults}
        row={row}
        onClose={onClose}
      />,
    );

    await act(async () => {
      const button = await findByRole('button');

      fireEvent.click(button);

      fireEvent.click(button);
    });

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('should call onClose when you click elsewhere', async () => {
    const { container, findByRole } = render(
      <div>
        <Notifications
          alert
          cols={1}
          items={items}
          label={label}
          noResults={noResults}
          row={row}
          onClose={onClose}
        />
      </div>,
    );

    await act(async () => {
      const button = await findByRole('button');
      const body = container.firstChild as ChildNode;

      fireEvent.click(button);

      fireEvent.mouseDown(body);
    });

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
