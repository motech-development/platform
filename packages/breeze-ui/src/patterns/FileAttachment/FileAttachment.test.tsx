import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Button } from '../../primitives/Button/Button';
import { FileAttachment } from './FileAttachment';

describe('FileAttachment', () => {
  it('presents a file name with persistent file actions', () => {
    renderBreeze(
      <FileAttachment
        actions={
          <>
            <Button appearance="outline">View file</Button>
            <Button variant="danger">Delete file</Button>
          </>
        }
        name="invoice.pdf"
      />,
    );

    const attachment = screen.getByText('invoice.pdf').closest('div');

    expect(attachment).toHaveAttribute('data-breeze-file-attachment');
    expect(attachment).toHaveClass(
      'min-h-16',
      'gap-4',
      'py-2.5',
      'sm:flex-row',
    );
    expect(screen.getByRole('button', { name: 'View file' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Delete file' })).toBeVisible();
    expect(attachment?.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
