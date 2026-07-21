import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { createElement, forwardRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { DropZone } from './DropZone';

interface MockFileDropItem {
  getFile: () => Promise<File>;
  getText: () => Promise<string>;
  kind: 'file';
  name: string;
  type: string;
}

const dropState = vi.hoisted(() => ({
  items: [] as MockFileDropItem[],
}));

vi.mock('react-aria-components/DropZone', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('react-aria-components/DropZone')>();
  const MockAriaDropZone = forwardRef<
    HTMLDivElement,
    ComponentProps<typeof original.DropZone>
  >(
    ({ children, onDrop }, ref): ReactElement =>
      createElement(
        'div',
        {
          'data-testid': 'drop-zone',
          onDrop: () =>
            onDrop?.({
              dropOperation: 'copy',
              items: dropState.items,
              type: 'drop',
              x: 0,
              y: 0,
            }),
          ref,
        },
        children as ReactNode,
      ),
  );

  return {
    ...original,
    DropZone: MockAriaDropZone,
  };
});

describe('DropZone native file read failures', () => {
  it('reports failed item context and treats a mixed batch atomically', async () => {
    const cause = new Error('Native file read failed');
    const onFileReadError = vi.fn();
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const readableFile = new File(['report'], 'report.pdf', {
      type: 'application/pdf',
    });

    dropState.items = [
      {
        getFile: vi.fn().mockResolvedValue(readableFile),
        getText: vi.fn().mockResolvedValue('report'),
        kind: 'file',
        name: readableFile.name,
        type: readableFile.type,
      },
      {
        getFile: vi.fn().mockRejectedValue(cause),
        getText: vi.fn().mockRejectedValue(cause),
        kind: 'file',
        name: 'locked.pdf',
        type: 'application/pdf',
      },
    ];

    renderBreeze(
      <DropZone.Root
        aria-label="Documents"
        onFileReadError={onFileReadError}
        onFiles={onFiles}
        onReject={onReject}
      >
        Drop documents
      </DropZone.Root>,
    );

    fireEvent.drop(screen.getByTestId('drop-zone'));

    await waitFor(() =>
      expect(onFileReadError).toHaveBeenCalledWith([
        {
          cause,
          itemIndex: 1,
          name: 'locked.pdf',
          type: 'application/pdf',
        },
      ]),
    );
    expect(onFiles).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
  });
});
