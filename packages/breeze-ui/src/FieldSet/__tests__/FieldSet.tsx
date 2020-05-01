import { render } from '@testing-library/react';
import React from 'react';
import FieldSet from '../FieldSet';

describe('FieldSet', () => {
  it('should have the correct styles', async () => {
    const { findByRole } = render(
      <FieldSet error={false} message="" name="test" spacing="md">
        <legend data-testid="legend">Hello</legend>
      </FieldSet>,
    );

    await expect(findByRole('group')).resolves.toHaveStyle(`
      padding-right: 38px;
      position: relative;
    `);
  });
});
