import { describe, expectTypeOf, it } from 'vitest';
import type { ConfirmationDialogProps } from './ConfirmationDialog/ConfirmationDialog';
import type { PasswordFieldProps } from './PasswordField/PasswordField';
import type { SegmentedControlProps } from './SegmentedControl/SegmentedControl';

// @ts-expect-error controlled confirmation state requires a callback unless read-only
const invalidConfirmation: ConfirmationDialogProps = {
  cancelLabel: 'Cancel',
  closeLabel: 'Close confirmation',
  confirmLabel: 'Confirm',
  description: 'Description',
  onConfirm: () => undefined,
  open: true,
  title: 'Title',
  trigger: 'Open confirmation',
};
// @ts-expect-error password controlled and uncontrolled values are exclusive
const invalidPassword: PasswordFieldProps = {
  defaultValue: 'initial',
  label: 'Password',
  onChange: () => undefined,
  value: 'current',
};
// @ts-expect-error segmented controlled value requires a callback unless read-only
const invalidSegmented: SegmentedControlProps = {
  'aria-label': 'Choice',
  options: [],
  value: 'one',
};
// @ts-expect-error confirmation dialogs require a semantic trigger
const missingConfirmationTrigger: ConfirmationDialogProps = {
  cancelLabel: 'Cancel',
  closeLabel: 'Close confirmation',
  confirmLabel: 'Confirm',
  description: 'Description',
  onConfirm: () => undefined,
  title: 'Title',
};

describe('pattern public prop contracts', () => {
  it('seals underlying implementation props', () => {
    expectTypeOf(invalidConfirmation).toMatchTypeOf<ConfirmationDialogProps>();
    expectTypeOf(
      missingConfirmationTrigger,
    ).toMatchTypeOf<ConfirmationDialogProps>();
    expectTypeOf(invalidPassword).toMatchTypeOf<PasswordFieldProps>();
    expectTypeOf(invalidSegmented).toMatchTypeOf<SegmentedControlProps>();
    expectTypeOf<PasswordFieldProps>().not.toHaveProperty('isDisabled');
    expectTypeOf<PasswordFieldProps>().not.toHaveProperty('onPress');
    expectTypeOf<SegmentedControlProps>().not.toHaveProperty('selectedKeys');
    expectTypeOf<ConfirmationDialogProps>().not.toHaveProperty('isOpen');
  });
});
