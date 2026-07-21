/** Generic, domain-neutral text used by Breeze controls and announcements. */
export interface BreezeMessages {
  /** Accessible label for clearing a value or selection. */
  clear: string;
  /** Accessible label for closing layered content. */
  close: string;
  /** Rejection text when only one file may be selected. */
  fileCountRejection: string;
  /** Rejection text when a file exceeds the configured maximum size. */
  fileSizeRejection: string;
  /** Rejection text when a file does not match the accepted types. */
  fileTypeRejection: string;
  /** Status text announced while content is loading. */
  loading: string;
  /** Status text announced when a collection has no matching results. */
  noResults: string;
  /** Accessible label for the provider-owned notification stack. */
  notifications: string;
  /** Accessible label for moving to the next pagination page. */
  nextPage: string;
  /** Accessible label prefix for a numbered pagination destination. */
  page: string;
  /** Accessible label for moving to the previous pagination page. */
  previousPage: string;
  /** Visible guidance when no date-picker value is selected. */
  selectDate: string;
  /** Accessible label for a complete date-and-time selection surface. */
  selectDateTime: string;
  /** Accessible label for the visually hidden native file input. */
  selectFiles: string;
  /** Visible label for selecting a time within a date-time picker. */
  selectTime: string;
  /** Accessible label for concealing a password value. */
  hidePassword: string;
  /** Accessible label for revealing a password value. */
  showPassword: string;
  /** Generic unread-notification state. */
  unreadNotifications: string;
}

/** Application-provided replacements for built-in `en-GB` Breeze messages. */
export type BreezeMessageOverrides = Partial<BreezeMessages>;

const defaultMessages: BreezeMessages = {
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
};

export function resolveMessages(
  overrides: BreezeMessageOverrides = {},
): BreezeMessages {
  return {
    ...defaultMessages,
    ...overrides,
  };
}
