import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import ErrorCard from '../ErrorCard';

describe('ErrorCard', () => {
  let history: MemoryHistory;

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/'],
    });

    history.goBack = jest.fn();
    history.push = jest.fn();
  });

  it('should go back to previous page', async () => {
    const { findByText } = render(
      <TestProvider history={history}>
        <ErrorCard description="Test" />
      </TestProvider>,
    );
    const button = await findByText('go-back');

    fireEvent.click(button);

    expect(history.goBack).toHaveBeenCalled();
  });

  it('should go to the set location', async () => {
    const { findByText } = render(
      <TestProvider history={history}>
        <ErrorCard backTo="/test" description="Test" />
      </TestProvider>,
    );
    const button = await findByText('go-back');

    fireEvent.click(button);

    expect(history.push).toHaveBeenCalledWith('/test');
  });
});
