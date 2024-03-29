import { fireEvent, render } from '@testing-library/react';
import { ReactNode } from 'react';
import TableCell from '../../TableCell/TableCell';
import Notifications from '../Notifications';

describe('Notifications', () => {
  let alert: boolean;
  let items: string[];
  let label: string;
  let noResults: ReactNode;
  let row: (item: string) => ReactNode;
  let onClose: jest.Mock;

  beforeEach(() => {
    alert = true;
    items = ['Alert 1', 'Alert 2'];
    label = 'Notifications';
    noResults = <div>No results</div>;
    row = (item) => <TableCell>{item}</TableCell>;
    onClose = jest.fn();
  });

  it('should show an alert notification', () => {
    const { container } = render(
      <Notifications
        alert={alert}
        items={items}
        label={label}
        noResults={noResults}
        row={row}
        onClose={onClose}
      />,
    );
    const icon = container.querySelector('svg[data-icon="asterisk"]');

    expect(icon).toBeInTheDocument();
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
    const icon = container.querySelector('svg[data-icon="asterisk"]');

    expect(icon).not.toBeInTheDocument();
  });

  it('should display notifications when you click the alert button', async () => {
    const { findByRole } = render(
      <Notifications
        alert={alert}
        items={items}
        label={label}
        noResults={noResults}
        row={row}
        onClose={onClose}
      />,
    );
    const button = await findByRole('button');

    fireEvent.click(button);

    await expect(findByRole('table')).resolves.toBeInTheDocument();
  });

  it('should hide the notifications if you click elsewhere', async () => {
    const { container, findByRole, queryByRole } = render(
      <div>
        <Notifications
          alert={alert}
          items={items}
          label={label}
          noResults={noResults}
          placement="bottom-start"
          row={row}
          onClose={onClose}
        />
      </div>,
    );

    const button = await findByRole('button');
    const body = container.firstChild as ChildNode;

    fireEvent.click(button);

    await expect(findByRole('table')).resolves.toBeInTheDocument();

    fireEvent.mouseDown(body);

    expect(queryByRole('table')).not.toBeInTheDocument();
  });

  it('should display the label', async () => {
    const { findByRole, findByText } = render(
      <Notifications
        alert={alert}
        items={items}
        label={label}
        noResults={noResults}
        row={row}
        onClose={onClose}
      />,
    );
    const button = await findByRole('button');

    expect(button).toHaveAttribute('aria-label', 'Notifications');

    fireEvent.click(button);

    await expect(findByText('Notifications')).resolves.toBeInTheDocument();
  });

  it('should call onClose when closed', async () => {
    const { findByRole } = render(
      <Notifications
        alert={alert}
        items={items}
        label={label}
        noResults={noResults}
        row={row}
        onClose={onClose}
      />,
    );

    const button = await findByRole('button');

    fireEvent.click(button);

    fireEvent.click(button);

    await Promise.resolve();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when you click elsewhere', async () => {
    const { container, findByRole } = render(
      <div>
        <Notifications
          alert={alert}
          cols={1}
          items={items}
          label={label}
          noResults={noResults}
          row={row}
          onClose={onClose}
        />
      </div>,
    );

    const button = await findByRole('button');
    const body = container.firstChild as ChildNode;

    fireEvent.click(button);

    fireEvent.mouseDown(body);

    await Promise.resolve();

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
