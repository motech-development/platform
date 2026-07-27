import { describe, expectTypeOf, it } from 'vitest';
import type { ApplicationShellProps } from './ApplicationShell/ApplicationShell';
import type { ConfirmationDialogProps } from './ConfirmationDialog/ConfirmationDialog';
import type { PasswordFieldProps } from './PasswordField/PasswordField';
import type { SegmentedControlProps } from './SegmentedControl/SegmentedControl';
import type { UserMenuProps } from './UserMenu/UserMenu';

// @ts-expect-error controlled compact navigation requires a change callback
const invalidApplicationShell: ApplicationShellProps = {
  account: 'Account',
  brand: 'Product',
  children: 'Content',
  compactNavigationOpen: true,
  navigation: 'Navigation',
  navigationLabel: 'Open navigation',
  skipLinkLabel: 'Skip to content',
};

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
// @ts-expect-error controlled user-menu state requires a change callback
const invalidUserMenu: UserMenuProps = {
  actions: [],
  'aria-label': 'User menu',
  open: true,
  userName: 'Taylor Reed',
};

describe('pattern public prop contracts', () => {
  it('seals underlying implementation props', () => {
    expectTypeOf(
      invalidApplicationShell,
    ).toMatchTypeOf<ApplicationShellProps>();
    expectTypeOf(invalidConfirmation).toMatchTypeOf<ConfirmationDialogProps>();
    expectTypeOf(
      missingConfirmationTrigger,
    ).toMatchTypeOf<ConfirmationDialogProps>();
    expectTypeOf(invalidPassword).toMatchTypeOf<PasswordFieldProps>();
    expectTypeOf(invalidSegmented).toMatchTypeOf<SegmentedControlProps>();
    expectTypeOf(invalidUserMenu).toMatchTypeOf<UserMenuProps>();
    expectTypeOf<PasswordFieldProps>().not.toHaveProperty('isDisabled');
    expectTypeOf<PasswordFieldProps>().not.toHaveProperty('onPress');
    expectTypeOf<SegmentedControlProps>().not.toHaveProperty('selectedKeys');
    expectTypeOf<ConfirmationDialogProps>().not.toHaveProperty('isOpen');
  });
});
