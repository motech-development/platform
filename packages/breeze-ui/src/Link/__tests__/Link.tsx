import { render, RenderResult } from '@testing-library/react';
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
      appearance: none;
      background: none;
      border: 0;
      color: #007aa3;
      cursor: pointer;
      font-weight: 600;
      font-size: inherit;
      margin: 0;
      padding: 0;
      text-decoration: underline;
    `);
  });

  it('should link to the correct location', async () => {
    const { findByText } = component;

    await expect(findByText('Hello')).resolves.toHaveAttribute('href', '/test');
  });
});
