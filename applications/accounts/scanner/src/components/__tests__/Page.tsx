import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import Page from '../Page';

describe('Page', () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <Page title="Test title">
        <div data-testid="page-content">Hello world</div>
      </Page>,
    );
  });

  it('should display page title', async () => {
    const { findAllByText } = component;

    await expect(findAllByText('Test title')).resolves.toHaveLength(2);
  });

  it('should display page content', async () => {
    const { findByTestId } = component;

    await expect(findByTestId('page-content')).resolves.toBeInTheDocument();
  });
});
