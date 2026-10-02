import type { CalendarDate } from '@internationalized/date';
import type { RefObject } from 'react';
import {
  createElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import { Dialog as AriaDialog } from 'react-aria-components/Dialog';
import CollectionPopover from '../../collections/CollectionPopover';
import {
  FieldLabel,
  FieldSupportingContent,
} from '../../fields/field.presentation';
import { fieldVariants, joinClassNames } from '../../fields/field.styles';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Button } from '../Button/Button';
import { CalendarSurface, parseCalendarDate } from '../Calendar/Calendar';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import type { IsoCalendarDate } from '../Typography/Typography';
import { Typography } from '../Typography/Typography';

const datePickerVariants = {
  base: {
    footer:
      'breeze:mbs-breeze-2 breeze:flex breeze:items-center breeze:border-0 breeze:border-bs breeze:border-solid breeze:border-breeze-line breeze:pbs-breeze-2',
    popover:
      'breeze:inline-[360px]! breeze:p-breeze-3 breeze:any-pointer-coarse:!p-0 breeze-date-picker-popover',
    trigger:
      'breeze:flex breeze:min-block-breeze-md breeze:any-pointer-coarse:min-block-breeze-tap breeze:min-inline-0 breeze:inline-full breeze:items-center breeze:justify-between breeze:gap-breeze-3 breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2 breeze:font-breeze-sans breeze:text-breeze-sm breeze:text-breeze-ink breeze:outline-offset-2 breeze:data-[hovered]:border-breeze-brand breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[invalid]:border-breeze-danger breeze:aria-disabled:cursor-default breeze:aria-disabled:bg-breeze-sunken breeze:disabled:cursor-not-allowed breeze:disabled:bg-breeze-sunken breeze:disabled:opacity-60',
    value: 'breeze:min-inline-0 breeze:flex-1 breeze:text-start',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

interface DatePickerCommonProps {
  /** Focuses the trigger when it first becomes enabled. */
  autoFocus?: boolean;
  /** Prevents opening and selecting. Defaults to `false`. */
  disabled?: boolean;
  /** Supporting guidance announced with the trigger. */
  description?: string;
  /** Visible validation message; any non-empty value marks the field invalid. */
  error?: string;
  /** Associates the submitted value with a form outside its ancestor tree. */
  form?: string;
  /** Sets the trigger id used by the field label. */
  id?: string;
  /** Accessible field label. */
  label: string;
  /** Replaces the field with a shape-preserving loading presentation. */
  loading?: boolean;
  /** Submitted field name. */
  name?: string;
  /** Temporary text shown before a date is selected. */
  placeholder?: string;
  /** Prevents changing the date while retaining focus and form participation. */
  readOnly?: boolean;
}

interface ControlledRequiredDatePickerProps {
  /** Current selected ISO calendar date, or `null` before one is chosen. */
  value: IsoCalendarDate | null;
  /** Reports the selected ISO calendar date without exposing a DOM event. */
  onChange: (value: IsoCalendarDate) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  defaultValue?: never;
}

interface UncontrolledRequiredDatePickerProps {
  /** Initial selected ISO calendar date. */
  defaultValue?: IsoCalendarDate;
  /** Reports the selected ISO calendar date without exposing a DOM event. */
  onChange?: (value: IsoCalendarDate) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  value?: never;
}

interface ControlledOptionalDatePickerProps {
  /** Current selected ISO calendar date, or `null` when empty. */
  value: IsoCalendarDate | null;
  /** Reports the selected ISO calendar date, or `null` when cleared. */
  onChange: (value: IsoCalendarDate | null) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  defaultValue?: never;
}

interface UncontrolledOptionalDatePickerProps {
  /** Initial selected ISO calendar date, or `null` when empty. */
  defaultValue?: IsoCalendarDate | null;
  /** Reports the selected ISO calendar date, or `null` when cleared. */
  onChange?: (value: IsoCalendarDate | null) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  value?: never;
}

interface RequiredDatePickerProps {
  /** Marks the field as required. Defaults to `true`; a required date cannot be cleared. */
  required?: true;
}

interface OptionalDatePickerProps {
  /** Makes the date optional and offers a control that clears it. */
  required: false;
}

/** Props for required or optional, controlled or uncontrolled ISO date selection. */
export type DatePickerProps = DatePickerCommonProps &
  (
    | (RequiredDatePickerProps &
        (
          | ControlledRequiredDatePickerProps
          | UncontrolledRequiredDatePickerProps
        ))
    | (OptionalDatePickerProps &
        (
          | ControlledOptionalDatePickerProps
          | UncontrolledOptionalDatePickerProps
        ))
  );

function DatePickerTriggerValue({
  placeholder,
  placeholderLocale,
  value,
  valueId,
}: Readonly<{
  placeholder: string;
  placeholderLocale?: string;
  value?: IsoCalendarDate | null;
  valueId: string;
}>) {
  return (
    <span className={datePickerVariants.base.value} id={valueId}>
      {value ? (
        <Typography element="span" format="date" value={value} />
      ) : (
        <span lang={placeholderLocale}>{placeholder}</span>
      )}
    </span>
  );
}

function getNextTriggerScrollTop(
  trigger: HTMLElement,
  ancestor: HTMLElement,
  requiredSpace: number,
  viewportBottom: number,
): number | undefined {
  const triggerTop = trigger.getBoundingClientRect().top;
  const { top: ancestorTop } = ancestor.getBoundingClientRect();
  const contentTop = ancestorTop + ancestor.clientTop;
  const visibleTop = Math.max(contentTop, 0);
  const visibleBottom = Math.min(
    contentTop + ancestor.clientHeight,
    viewportBottom,
  );

  if (visibleBottom <= visibleTop) return undefined;

  const targetTop = Math.max(visibleTop + 8, visibleBottom - requiredSpace);
  let scrollDelta = 0;

  if (triggerTop < visibleTop + 8) {
    scrollDelta = triggerTop - (visibleTop + 8);
  } else if (triggerTop > targetTop) {
    scrollDelta = triggerTop - targetTop;
  }

  const maxScrollTop = ancestor.scrollHeight - ancestor.clientHeight;
  const nextScrollTop = Math.round(
    Math.max(0, Math.min(maxScrollTop, ancestor.scrollTop + scrollDelta)),
  );

  return nextScrollTop === ancestor.scrollTop ? undefined : nextScrollTop;
}

function scrollTriggerIntoView(trigger: HTMLElement): boolean {
  const requiredSpace = 400;
  const viewportBottom = trigger.ownerDocument.documentElement.clientHeight;
  let didScroll = false;

  for (
    let ancestor = trigger.parentElement;
    ancestor !== null;
    ancestor = ancestor.parentElement
  ) {
    const { overflowY } = getComputedStyle(ancestor);

    if (
      ['auto', 'scroll'].includes(overflowY) &&
      ancestor.scrollHeight > ancestor.clientHeight
    ) {
      const nextScrollTop = getNextTriggerScrollTop(
        trigger,
        ancestor,
        requiredSpace,
        viewportBottom,
      );

      if (nextScrollTop !== undefined) {
        ancestor.scrollTop = nextScrollTop;
        didScroll = true;
      }
    }
  }

  return didScroll;
}

function DatePickerClear({
  disabled,
  onClear,
}: Readonly<{ disabled: boolean; onClear: () => void }>) {
  const { getMessageLocale, messages } = useBreezeContext();

  return (
    <div className={datePickerVariants.base.footer}>
      <span lang={getMessageLocale('clearDate')}>
        <Button
          disabled={disabled}
          onAction={onClear}
          size="sm"
          variant="quiet"
        >
          {messages.clearDate}
        </Button>
      </span>
    </div>
  );
}

function DatePickerPopover({
  calendarKey,
  dialogId,
  disabled,
  isOpen,
  label,
  onChange,
  onClear,
  onOpenChange,
  triggerRef,
  value,
}: Readonly<{
  calendarKey: number;
  dialogId: string;
  disabled: boolean;
  isOpen: boolean;
  label: string;
  onChange: (date: CalendarDate | null) => void;
  onClear?: () => void;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  value: IsoCalendarDate | null | undefined;
}>) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    const popover = dialog?.closest<HTMLElement>(
      '[data-breeze-overlay="popover"]',
    );

    if (!dialog || !popover) return undefined;

    const focusRovingDate = () => {
      if (
        popover.hasAttribute('inert') ||
        popover.dataset.breezeInteractive !== 'true'
      ) {
        return false;
      }

      const document = dialog.ownerDocument;
      const { activeElement } = document;

      if (
        activeElement === triggerRef.current ||
        activeElement === document.body ||
        activeElement === document.documentElement
      ) {
        dialog
          .querySelector<HTMLElement>('[role="button"][tabindex="0"]')
          ?.focus();
      }

      return true;
    };

    const observer = new MutationObserver(() => {
      if (focusRovingDate()) observer.disconnect();
    });

    observer.observe(popover, {
      attributeFilter: ['data-breeze-interactive', 'inert'],
      attributes: true,
    });

    if (focusRovingDate()) observer.disconnect();

    return () => observer.disconnect();
  }, [isOpen, triggerRef]);

  return (
    <CollectionPopover
      className={datePickerVariants.base.popover}
      containerPadding={4}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
    >
      <AriaDialog aria-label={label} id={dialogId} ref={dialogRef}>
        <CalendarSurface
          autoFocus={isOpen}
          key={calendarKey}
          disabled={disabled}
          label={label}
          onChange={onChange}
          value={value == null ? null : parseCalendarDate(value)}
        />
        {onClear && (
          <DatePickerClear
            disabled={disabled || value == null}
            onClear={onClear}
          />
        )}
      </AriaDialog>
    </CollectionPopover>
  );
}

/**
 * Renders a date field, required by default, with a locale-formatted trigger and calendar.
 *
 * @summary Single-date field with ISO values and a calendar popover.
 */
export function DatePicker(props: Readonly<DatePickerProps>) {
  const {
    autoFocus = false,
    description,
    disabled = false,
    error,
    form,
    id,
    label,
    loading = false,
    name,
    placeholder,
    readOnly = false,
    ...selection
  } = props;
  const { defaultValue, value } = selection;
  const required = selection.required !== false;
  const { getMessageLocale, messages } = useBreezeContext();
  const placeholderText = placeholder ?? messages.selectDate;
  const placeholderLocale =
    placeholder === undefined ? getMessageLocale('selectDate') : undefined;
  const visibleDescription = description?.trim() || undefined;
  const visibleError = error?.trim() || undefined;
  const interactionDisabled = disabled || loading;
  const isInvalid = !loading && visibleError !== undefined;
  const fieldId = useId();
  const labelId = `${fieldId}-label`;
  const valueId = `${fieldId}-value`;
  const dialogId = `${fieldId}-dialog`;
  const descriptionId = visibleDescription
    ? `${fieldId}-description`
    : undefined;
  const errorId = visibleError ? `${fieldId}-error` : undefined;
  const requiredId = required ? `${fieldId}-required` : undefined;
  const triggerId = id ?? `${fieldId}-trigger`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasAutoFocused = useRef(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<
    IsoCalendarDate | null | undefined
  >(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const [fieldsetDisabled, setFieldsetDisabled] = useState(false);
  const selectedValue = value === undefined ? uncontrolledValue : value;
  const effectiveDisabled = interactionDisabled || fieldsetDisabled;
  const describedBy =
    [descriptionId, !loading ? errorId : undefined, requiredId]
      .filter(Boolean)
      .join(' ') || undefined;

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return undefined;

    const updateFieldsetDisabled = () => {
      setFieldsetDisabled(!interactionDisabled && trigger.matches(':disabled'));
    };

    updateFieldsetDisabled();

    const observer = new MutationObserver(updateFieldsetDisabled);

    for (
      let ancestor = trigger.parentElement;
      ancestor !== null;
      ancestor = ancestor.parentElement
    ) {
      if (ancestor.tagName === 'FIELDSET') {
        observer.observe(ancestor, {
          attributeFilter: ['disabled'],
          attributes: true,
        });
      }
    }

    return () => observer.disconnect();
  }, [interactionDisabled]);

  useEffect(() => {
    if (value !== undefined) return undefined;

    const handleReset = (event: Event) => {
      const formElement = triggerRef.current?.form;

      if (!formElement || event.target !== formElement) return;

      queueMicrotask(() => {
        if (!event.defaultPrevented) {
          setUncontrolledValue(defaultValue);
        }
      });
    };

    document.addEventListener('reset', handleReset, true);

    return () => document.removeEventListener('reset', handleReset, true);
  }, [defaultValue, value]);

  useEffect(() => {
    if ((effectiveDisabled || readOnly) && isOpen) {
      setIsOpen(false);
    }
  }, [effectiveDisabled, isOpen, readOnly]);

  useEffect(() => {
    if (!autoFocus || effectiveDisabled || hasAutoFocused.current) return;

    const trigger = triggerRef.current;

    if (!trigger || trigger.matches(':disabled')) return;

    trigger.focus();
    hasAutoFocused.current = trigger.ownerDocument.activeElement === trigger;
  }, [autoFocus, effectiveDisabled]);

  const visibleOpen = isOpen && !effectiveDisabled && !readOnly;
  const handleOpenChange = (open: boolean) => {
    if (
      open &&
      (effectiveDisabled ||
        readOnly ||
        triggerRef.current?.matches(':disabled'))
    ) {
      return;
    }

    if (open && !isOpen) {
      setCalendarKey((currentKey) => currentKey + 1);
    }

    setIsOpen(open);
  };

  const handleTriggerPress = () => {
    if (visibleOpen) {
      handleOpenChange(false);
      return;
    }

    const trigger = triggerRef.current;

    if (
      !trigger ||
      effectiveDisabled ||
      readOnly ||
      trigger.matches(':disabled')
    ) {
      return;
    }

    if (scrollTriggerIntoView(trigger)) {
      if (typeof requestAnimationFrame === 'undefined') {
        setTimeout(() => handleOpenChange(true), 0);
      } else {
        requestAnimationFrame(() => handleOpenChange(true));
      }

      return;
    }

    handleOpenChange(true);
  };
  const reportChange = (nextValue: IsoCalendarDate) => {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }

    selection.onChange?.(nextValue);
    handleOpenChange(false);
  };
  const handleClear = () => {
    if (
      effectiveDisabled ||
      readOnly ||
      triggerRef.current?.matches(':disabled')
    ) {
      return;
    }

    if (selection.required !== false) return;

    if (value === undefined) {
      setUncontrolledValue(null);
    }

    selection.onChange?.(null);
    handleOpenChange(false);
  };
  const handleDateChange = (date: CalendarDate | null) => {
    if (
      !date ||
      effectiveDisabled ||
      readOnly ||
      triggerRef.current?.matches(':disabled')
    ) {
      return;
    }

    reportChange(date.toString() as IsoCalendarDate);
  };

  return (
    <div
      className={fieldVariants.base.root}
      data-required={required || undefined}
    >
      <FieldLabel
        htmlFor={triggerId}
        id={labelId}
        label={label}
        loading={loading}
        onClick={() => triggerRef.current?.focus()}
      />
      <span className={fieldVariants.base.control}>
        <AriaButton
          className={joinClassNames(
            datePickerVariants.base.trigger,
            loading && 'breeze:!opacity-0',
          )}
          isDisabled={interactionDisabled}
          onPress={handleTriggerPress}
          ref={triggerRef}
          render={(buttonProps) =>
            createElement('button', {
              ...buttonProps,
              'aria-busy': loading || undefined,
              'aria-controls': visibleOpen ? dialogId : undefined,
              'aria-describedby': describedBy,
              'aria-disabled': readOnly || undefined,
              'aria-errormessage': !loading ? errorId : undefined,
              'aria-expanded': visibleOpen,
              'aria-haspopup': 'dialog',
              'aria-invalid': isInvalid || undefined,
              'aria-label': loading ? label : undefined,
              'aria-labelledby': !loading ? `${labelId} ${valueId}` : undefined,
              'data-invalid': isInvalid || undefined,
              form,
              id: triggerId,
              type: 'button',
            })
          }
        >
          <DatePickerTriggerValue
            placeholder={placeholderText}
            placeholderLocale={placeholderLocale}
            value={selectedValue}
            valueId={valueId}
          />
          <Icon name="calendar" size="sm" />
        </AriaButton>
        {loading && (
          <span className={fieldVariants.base.skeleton}>
            <Skeleton
              blockSize="100%"
              inlineSize="100%"
              label={messages.loading}
              shape="rectangle"
            />
          </span>
        )}
      </span>
      {name && (
        <input
          disabled={interactionDisabled}
          form={form}
          name={name}
          type="hidden"
          value={selectedValue ?? ''}
        />
      )}
      {required && (
        <span
          className="breeze:sr-only"
          id={requiredId}
          lang={getMessageLocale('required')}
        >
          {messages.required}
        </span>
      )}
      <DatePickerPopover
        calendarKey={calendarKey}
        dialogId={dialogId}
        disabled={effectiveDisabled}
        isOpen={visibleOpen}
        label={label}
        onChange={handleDateChange}
        onClear={required ? undefined : handleClear}
        onOpenChange={handleOpenChange}
        triggerRef={triggerRef}
        value={selectedValue}
      />
      <FieldSupportingContent
        description={visibleDescription}
        descriptionId={descriptionId}
        loading={loading}
      />
      {visibleError && (
        <p
          aria-hidden={loading || undefined}
          className={fieldVariants.base.error}
          id={errorId}
        >
          {loading ? (
            <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
          ) : (
            visibleError
          )}
        </p>
      )}
    </div>
  );
}
