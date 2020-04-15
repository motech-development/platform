import { render } from '@testing-library/react';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import DataList from '../DataList';

describe('DataList', () => {
  it('should render items', async () => {
    const data = [
      {
        name: 'Item 1',
      },
      {
        name: 'Item 2',
      },
    ];
    const { findAllByTestId } = render(
      <TestProvider>
        <DataList
          items={data}
          render={items =>
            items.map(({ name }) => (
              <div key={name} data-testid="items">
                {name}
              </div>
            ))
          }
        />
      </TestProvider>,
    );

    await expect(findAllByTestId('items')).resolves.toHaveLength(2);
  });

  it('should render error card when there are no items', async () => {
    const { findByText } = render(
      <TestProvider>
        <DataList items={[]} render={() => <div />} />
      </TestProvider>,
    );

    await expect(findByText('title')).resolves.toBeInTheDocument();
  });
});
