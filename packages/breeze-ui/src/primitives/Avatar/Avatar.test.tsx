import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('uses meaningful initials when no image is supplied', () => {
    renderBreeze(<Avatar name="Ada Lovelace" />);

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent(
      'AL',
    );
  });

  it('preserves non-BMP characters in generated initials', () => {
    renderBreeze(<Avatar name="🧑 Ada" />);

    expect(screen.getByRole('img', { name: '🧑 Ada' })).toHaveTextContent(
      '🧑A',
    );
  });

  it('supports a single-initial square entity mark', () => {
    renderBreeze(
      <Avatar
        initials="M"
        name="Motech Development"
        shape="square"
        size="sm"
      />,
    );

    expect(screen.getByRole('img', { name: 'Motech Development' })).toHaveClass(
      'rounded-none',
      'size-9',
    );
    expect(
      screen.getByRole('img', { name: 'Motech Development' }),
    ).toHaveTextContent('M');
  });

  it('supports a medium alternate entity marker', () => {
    renderBreeze(
      <Avatar
        initials="N"
        name="Northline Digital"
        shape="square"
        size="md"
        tone="accent"
      />,
    );

    const avatar = screen.getByRole('img', { name: 'Northline Digital' });

    expect(avatar).toHaveAttribute('data-tone', 'accent');
    expect(avatar).toHaveClass(
      'bg-[var(--breeze-accent-soft)]',
      'size-9',
      'text-[var(--breeze-accent)]',
    );
  });

  it('falls back to initials when the image cannot load', () => {
    renderBreeze(<Avatar name="Grace Hopper" src="/missing.png" />);

    fireEvent.error(screen.getByRole('presentation'));

    expect(screen.getByRole('img', { name: 'Grace Hopper' })).toHaveTextContent(
      'GH',
    );
  });
});
