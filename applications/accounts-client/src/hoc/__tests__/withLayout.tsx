import { render, waitForElement } from '@testing-library/react';
import React, { FC, MemoExoticComponent } from 'react';
import TestProvider from '../../utils/TestProvider';
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
});
