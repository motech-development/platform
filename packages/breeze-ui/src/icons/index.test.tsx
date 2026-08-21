import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  AddIcon,
  BuildingIcon,
  ChartIcon,
  FileTextIcon,
  RotateIcon,
  SignOutIcon,
  UsersIcon,
  WalletIcon,
  WarningIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from './index';

describe('curated icons', () => {
  it('is decorative by default and can carry an accessible name', () => {
    const { container } = render(
      <>
        <AddIcon size={24} />
        <BuildingIcon />
        <ChartIcon />
        <FileTextIcon />
        <RotateIcon />
        <SignOutIcon />
        <UsersIcon />
        <WalletIcon />
        <WarningIcon aria-label="Warning" />
        <ZoomInIcon />
        <ZoomOutIcon />
      </>,
    );

    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(container.querySelector('svg')).toHaveClass('inline-block');
    expect(container.querySelector('svg')).toHaveStyle({
      height: '24px',
      width: '24px',
    });
    expect(screen.getByRole('img', { name: 'Warning' })).toBeInTheDocument();
    expect(container.querySelector('.lucide-triangle-alert')).toBeVisible();
    expect(container.querySelector('.lucide-log-out')).toBeVisible();
    expect(container.querySelector('.lucide-building-2')).toBeVisible();
    expect(
      container.querySelector('.lucide-chart-no-axes-combined'),
    ).toBeVisible();
    expect(container.querySelector('.lucide-file-text')).toBeVisible();
    expect(container.querySelector('.lucide-rotate-cw')).toBeVisible();
    expect(container.querySelector('.lucide-users')).toBeVisible();
    expect(container.querySelector('.lucide-wallet')).toBeVisible();
    expect(container.querySelector('.lucide-zoom-in')).toBeVisible();
    expect(container.querySelector('.lucide-zoom-out')).toBeVisible();
  });

  it('treats empty and whitespace-only accessible labels as absent', () => {
    render(
      <>
        <AddIcon aria-label="" data-testid="empty-label" />
        <WarningIcon aria-label="   " data-testid="blank-label" />
      </>,
    );

    expect(screen.getByTestId('empty-label')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByTestId('empty-label')).not.toHaveAttribute('role');
    expect(screen.getByTestId('blank-label')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByTestId('blank-label')).not.toHaveAttribute('role');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
