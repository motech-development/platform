import type { CalendarDate } from '@internationalized/date';
import { parseDate } from '@internationalized/date';
import type { RefObject } from 'react';
import { createElement, useEffect, useId, useRef, useState } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import { Dialog as AriaDialog } from 'react-aria-components/Dialog';
import { useBreezeContext } from '../../provider/BreezeContext';
import { CalendarSurface } from '../Calendar/Calendar';
import CollectionPopover from '../Collection/CollectionPopover';
import {
  FieldLabel,
  FieldSupportingContent,
} from '../Field/field.presentation';
import { fieldVariants, joinClassNames } from '../Field/field.styles';
import { Icon } from '../Icon/Icon';
import type { IsoCalendarDate } from '../Typography/Typography';
import { Typography } from '../Typography/Typography';

const datePickerVariants = {
  base: {
    popover:
      'breeze:!inline-size-[360px] breeze:max-inline-size-[calc(100vw-24px)] breeze:p-breeze-3',
    trigger:
      'breeze:flex breeze:min-block-breeze-md breeze:any-pointer-coarse:min-block-breeze-tap breeze:min-inline-size-0 breeze:inline-size-full breeze:items-center breeze:justify-between breeze:gap-breeze-3 breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2 breeze:font-breeze-sans breeze:text-breeze-sm breeze:text-breeze-ink breeze:outline-offset-2 breeze:data-[hovered]:border-breeze-brand breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[invalid]:border-breeze-danger breeze:disabled:cursor-not-allowed breeze:disabled:bg-breeze-sunken breeze:disabled:opacity-60',
    value: 'breeze:min-inline-size-0 breeze:flex-1 breeze:text-start',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

interface DatePickerCommonProps {
  /** Focuses the trigger when the component is mounted. */
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
  /** Submitted field name. */
  name?: string;
  /** Temporary text shown before a date is selected. */
  placeholder?: string;
  /** Marks the field as required. Defaults to `true`. */
  required?: boolean;
}

interface ControlledDatePickerProps {
  /** Current selected ISO calendar date. */
  value: IsoCalendarDate;
  /** Reports the selected ISO calendar date without exposing a DOM event. */
  onChange: (value: IsoCalendarDate) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  defaultValue?: never;
}

interface UncontrolledDatePickerProps {
  /** Initial selected ISO calendar date. */
  defaultValue?: IsoCalendarDate;
  /** Reports the selected ISO calendar date without exposing a DOM event. */
  onChange?: (value: IsoCalendarDate) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  value?: never;
}

/** Props for controlled or uncontrolled ISO date selection. */
export type DatePickerProps = DatePickerCommonProps &
  (ControlledDatePickerProps | UncontrolledDatePickerProps);

function DatePickerTriggerValue({
  placeholder,
  value,
  valueId,
}: Readonly<{
  placeholder: string;
  value?: IsoCalendarDate;
  valueId: string;
}>) {
  return (
    <span className={datePickerVariants.base.value} id={valueId}>
      {value ? (
        <Typography element="span" format="date" value={value} />
      ) : (
        placeholder
      )}
    </span>
  );
}

function DatePickerPanelScrollEffect({
  isOpen,
  panelRef,
}: Readonly<{
  isOpen: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
}>) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const scrollPanel = () => {
      const panel =
        panelRef.current?.closest<HTMLElement>(
          '[data-breeze-overlay="popover"]',
        ) ?? panelRef.current;

      if (!panel) return;

      panel.scrollIntoView?.({ block: 'nearest' });

      for (
        let ancestor = panel.parentElement;
        ancestor !== null;
        ancestor = ancestor.parentElement
      ) {
        const { overflowY } = getComputedStyle(ancestor);

        if (
          ['auto', 'scroll'].includes(overflowY) &&
          ancestor.scrollHeight > ancestor.clientHeight
        ) {
          const { bottom: panelBottom, top: panelTop } =
            panel.getBoundingClientRect();
          const { top: ancestorTop } = ancestor.getBoundingClientRect();
          const visibleTop = ancestorTop + ancestor.clientTop;
          const visibleBottom = visibleTop + ancestor.clientHeight;

          if (panelTop < visibleTop) {
            ancestor.scrollTop -= visibleTop - panelTop;
          } else if (panelBottom > visibleBottom) {
            ancestor.scrollTop += panelBottom - visibleBottom;
          }
        }
      }
    };

    if (typeof requestAnimationFrame === 'undefined') {
      const timeout = setTimeout(scrollPanel, 0);
      return () => clearTimeout(timeout);
    }

    const frame = requestAnimationFrame(scrollPanel);
    return () => cancelAnimationFrame(frame);
  }, [isOpen, panelRef]);

  return null;
}

function DatePickerPopover({
  calendarKey,
  dialogId,
  disabled,
  isOpen,
  label,
  onChange,
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
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  value: IsoCalendarDate | undefined;
}>) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <CollectionPopover
      className={datePickerVariants.base.popover}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
    >
      <AriaDialog aria-label={label} id={dialogId} ref={panelRef}>
        <DatePickerPanelScrollEffect isOpen={isOpen} panelRef={panelRef} />
        <CalendarSurface
          key={calendarKey}
          disabled={disabled}
          label={label}
          onChange={onChange}
          value={value === undefined ? null : parseDate(value)}
        />
      </AriaDialog>
    </CollectionPopover>
  );
}

/**
 * Renders a required date field with a locale-formatted trigger and calendar.
 *
 * @summary Single-date field with ISO values and a calendar popover.
 */
export function DatePicker({
  autoFocus = false,
  defaultValue,
  description,
  disabled = false,
  error,
  form,
  id,
  label,
  name,
  onChange,
  placeholder = 'Select a date',
  required = true,
  value,
}: Readonly<DatePickerProps>) {
  useBreezeContext();
  const visibleDescription = description?.trim() || undefined;
  const visibleError = error?.trim() || undefined;
  const isInvalid = visibleError !== undefined;
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
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const selectedValue = value ?? uncontrolledValue;
  const describedBy =
    [descriptionId, errorId, requiredId].filter(Boolean).join(' ') || undefined;

  const handleOpenChange = (open: boolean) => {
    if (open && !isOpen) {
      setCalendarKey((currentKey) => currentKey + 1);
    }

    setIsOpen(open);
  };
  const handleDateChange = (date: CalendarDate | null) => {
    if (!date) return;

    const nextValue = date.toString() as IsoCalendarDate;

    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }

    onChange?.(nextValue);
    handleOpenChange(false);
  };

  return (
    <div
      aria-labelledby={labelId}
      className={fieldVariants.base.root}
      data-required={required || undefined}
      role="group"
    >
      <FieldLabel id={labelId} label={label} loading={false} />
      <AriaButton
        autoFocus={autoFocus}
        className={joinClassNames(
          datePickerVariants.base.trigger,
          isInvalid && 'breeze:border-breeze-danger',
        )}
        isDisabled={disabled}
        onPress={() => handleOpenChange(!isOpen)}
        ref={triggerRef}
        render={(buttonProps) =>
          createElement('button', {
            ...buttonProps,
            'aria-controls': dialogId,
            'aria-describedby': describedBy,
            'aria-expanded': isOpen,
            'aria-haspopup': 'dialog',
            'aria-invalid': isInvalid || undefined,
            'aria-labelledby': `${labelId} ${valueId}`,
            'data-invalid': isInvalid || undefined,
            id: triggerId,
            type: 'button',
          })
        }
      >
        <DatePickerTriggerValue
          placeholder={placeholder}
          value={selectedValue}
          valueId={valueId}
        />
        <Icon name="calendar" size="sm" />
      </AriaButton>
      {name && (
        <input
          disabled={disabled}
          form={form}
          name={name}
          type="hidden"
          value={selectedValue ?? ''}
        />
      )}
      {required && (
        <span className="breeze:sr-only" id={requiredId}>
          Required
        </span>
      )}
      <DatePickerPopover
        calendarKey={calendarKey}
        dialogId={dialogId}
        disabled={disabled}
        isOpen={isOpen}
        label={label}
        onChange={handleDateChange}
        onOpenChange={handleOpenChange}
        triggerRef={triggerRef}
        value={selectedValue}
      />
      <FieldSupportingContent
        description={visibleDescription}
        descriptionId={descriptionId}
        error={visibleError}
        errorId={errorId}
        loading={false}
      />
    </div>
  );
}
