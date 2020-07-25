import { render } from '@testing-library/react';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import DataList from '../DataList';

type TestData = {
  name: string;
};

const row = (data: TestData) => <div data-testid="item">{data.name}</div>;

describe('DataList', () => {
  let data: TestData[];

  beforeEach(() => {
    data = [
      {
        name: 'Item 1',
      },
      {
        name: 'Item 2',
      },
    ];
  });

  it('should display the error card if there are no items', async () => {
    const { findByText } = render(
      <TestProvider>
        <DataList items={[]} row={row} noResults="No results" />
      </TestProvider>,
    );

    await expect(findByText('No results')).resolves.toBeInTheDocument();
  });

  it('should display header', async () => {
    const { findByText } = render(
      <TestProvider>
        <DataList
          items={data}
          row={row}
          header="Test header"
          noResults="No results"
        />
      </TestProvider>,
    );

    await expect(findByText('Test header')).resolves.toBeInTheDocument();
  });

  it('should iterate through items and list them out', async () => {
    const { findAllByTestId } = render(
      <TestProvider>
        <DataList items={data} row={row} noResults="No results" />
      </TestProvider>,
    );

    await expect(findAllByTestId('item')).resolves.toHaveLength(2);
  });
});
