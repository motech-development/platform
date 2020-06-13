import { render } from '@testing-library/react';
import React from 'react';
import ButtonLink from '../ButtonLink';

describe('ButtonLink', () => {
  it('should have the correct styles', async () => {
    const { findByRole } = render(<ButtonLink>Hello</ButtonLink>);

    await expect(findByRole('button')).resolves.toHaveStyle(`
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
});
