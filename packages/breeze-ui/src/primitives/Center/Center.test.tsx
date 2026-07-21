import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Center } from './Center';

describe('Center', () => {
  it('provides a neutral container for centred content', () => {
    render(
      <BreezeProvider locale="en-GB">
        <Center aria-label="Empty state">
          <p>Nothing here yet</p>
        </Center>
      </BreezeProvider>,
    );

    expect(screen.getByLabelText('Empty state')).toContainElement(
      screen.getByText('Nothing here yet'),
    );
  });
});
