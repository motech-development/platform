import { describe, expect, it } from 'vitest';
import { resolveMessages } from './messages';

describe('resolveMessages', () => {
  it('provides complete British English defaults', () => {
    expect(resolveMessages()).toEqual({
      clear: 'Clear',
      close: 'Close',
      fileCountRejection: 'Only one file may be selected.',
      fileSizeRejection: 'File exceeds the maximum size.',
      fileTypeRejection: 'File type is not accepted.',
      hidePassword: 'Hide password',
      loading: 'Loading',
      nextPage: 'Next page',
      noResults: 'No results',
      notifications: 'Notifications',
      page: 'Page',
      previousPage: 'Previous page',
      selectDate: 'Select date',
      selectDateTime: 'Select date and time',
      selectFiles: 'Select files',
      selectTime: 'Select time',
      showPassword: 'Show password',
      unreadNotifications: 'Unread notifications',
    });
  });

  it('merges application translations without removing defaults', () => {
    expect(
      resolveMessages({
        loading: 'Chargement',
      }),
    ).toEqual({
      clear: 'Clear',
      close: 'Close',
      fileCountRejection: 'Only one file may be selected.',
      fileSizeRejection: 'File exceeds the maximum size.',
      fileTypeRejection: 'File type is not accepted.',
      hidePassword: 'Hide password',
      loading: 'Chargement',
      nextPage: 'Next page',
      noResults: 'No results',
      notifications: 'Notifications',
      page: 'Page',
      previousPage: 'Previous page',
      selectDate: 'Select date',
      selectDateTime: 'Select date and time',
      selectFiles: 'Select files',
      selectTime: 'Select time',
      showPassword: 'Show password',
      unreadNotifications: 'Unread notifications',
    });
  });
});
