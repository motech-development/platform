import { describe, expectTypeOf, it } from 'vitest';
import type { FileRejection } from '../internal/types/file';
import type { DropZoneRootProps } from './DropZone/DropZone';
import type {
  FileTriggerButtonProps,
  FileTriggerRootProps,
} from './FileTrigger/FileTrigger';

describe('file primitive public contracts', () => {
  it('exposes native files and stable Breeze rejection records', () => {
    expectTypeOf<Parameters<DropZoneRootProps['onFiles']>[0]>().toEqualTypeOf<
      File[]
    >();
    expectTypeOf<
      Parameters<NonNullable<FileTriggerRootProps['onReject']>>[0]
    >().toEqualTypeOf<FileRejection[]>();
    expectTypeOf<FileRejection['reasons'][number]>().toEqualTypeOf<
      'file-count' | 'file-size' | 'file-type'
    >();
  });

  it('supports native file constraints without exposing React Aria events', () => {
    expectTypeOf<{
      acceptDirectory: true;
      acceptedFileTypes: readonly ['image/*', '.pdf'];
      allowsMultiple: true;
      children: null;
      defaultCamera: 'environment';
      maxFileSize: number;
      onFiles: (files: File[]) => void;
    }>().toMatchTypeOf<FileTriggerRootProps>();
    expectTypeOf<FileTriggerRootProps>().not.toHaveProperty('onSelect');
    expectTypeOf<FileTriggerRootProps>().not.toHaveProperty('onClick');
    expectTypeOf<FileTriggerButtonProps>().not.toHaveProperty('onClick');
    expectTypeOf<FileTriggerButtonProps>().not.toHaveProperty('onPress');
    expectTypeOf<DropZoneRootProps>().not.toHaveProperty('onDrop');
    expectTypeOf<DropZoneRootProps>().not.toHaveProperty('onDragEnter');
    expectTypeOf<DropZoneRootProps>().not.toHaveProperty('getDropOperation');
    expectTypeOf<DropZoneRootProps>().not.toHaveProperty('isDisabled');
  });
});
