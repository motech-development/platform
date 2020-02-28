import { fireEvent, render, waitForElement } from '@testing-library/react';
import React, { FC, MemoExoticComponent } from 'react';
import TestProvider, { logout } from '../../utils/TestProvider';
import withLayout from '../withLayout';

describe('withLayout', () => {
  let Component: FC;
  let LayoutComponent: MemoExoticComponent<() => JSX.Element>;

  beforeEach(() => {
    Component = () => <p data-testid="component">Hello world</p>;
    LayoutComponent = withLayout(Component);
  });

  it('should render a component with the layout', async () => {
    const { findByTestId } = render(
      <TestProvider>
        <LayoutComponent />
      </TestProvider>,
    );

    const component = await waitForElement(() => findByTestId('component'));

    expect(component).toBeInTheDocument();
  });

  it('should log you out when logout button clicked', async () => {
    const { findByRole } = render(
      <TestProvider>
        <LayoutComponent />
      </TestProvider>,
    );

    const button = await findByRole('button');

    fireEvent.click(button);

    expect(logout).toHaveBeenCalledWith({
      returnTo: window.location.origin,
    });
  });
});
