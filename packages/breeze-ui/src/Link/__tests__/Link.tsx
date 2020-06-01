import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Link from '../Link';

describe('Link', () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <MemoryRouter>
        <Link to="/test">Hello</Link>
      </MemoryRouter>,
    );
  });

  it('should have the correct styles', async () => {
    const { findByText } = component;

    await expect(findByText('Hello')).resolves.toHaveStyle(`
      color: #007fa8;
      font-weight: 600;
    `);
  });

  it('should link to the correct location', async () => {
    const { findByText } = component;

    await expect(findByText('Hello')).resolves.toHaveAttribute('href', '/test');
  });
});
