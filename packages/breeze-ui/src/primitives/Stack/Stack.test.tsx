import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Stack } from './Stack';

describe('Stack', () => {
  it('groups vertically ordered content without changing its semantics', () => {
    render(
      <BreezeProvider locale="en-GB">
        <Stack aria-label="Details">
          <span>First</span>
          <span>Second</span>
        </Stack>
      </BreezeProvider>,
    );

    const stack = screen.getByLabelText('Details');

    expect(stack.children).toHaveLength(2);
    expect(stack).toHaveTextContent('FirstSecond');
  });
});
