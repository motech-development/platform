import {
  Grid,
  NumberField,
  RadioGroup,
  Select,
  TextField,
} from '@motech-development/breeze-ui';
import type { ReactNode } from 'react';
import { maximumYearEndDay, vatRegistrationMaxLength } from './company';

type VatScheme = 'flatRate' | 'none' | 'standard';

export function VatSchemeField({
  error,
  invalid = false,
  label,
  labels,
  onChange,
  selection,
}: Readonly<{
  error?: ReactNode;
  invalid?: boolean;
  label: string;
  labels: Readonly<Record<VatScheme, string>>;
  onChange: (value: VatScheme) => void;
  selection: '' | VatScheme;
}>) {
  return (
    <RadioGroup.Root
      invalid={invalid}
      onSelectionChange={(value) => onChange(value as VatScheme)}
      orientation="horizontal"
      selection={selection}
    >
      <RadioGroup.Label>{label}</RadioGroup.Label>
      {(['none', 'standard', 'flatRate'] as const).map((value) => (
        <RadioGroup.Item key={value} value={value}>
          <RadioGroup.Control>
            <RadioGroup.Indicator />
            <RadioGroup.ItemLabel>{labels[value]}</RadioGroup.ItemLabel>
          </RadioGroup.Control>
        </RadioGroup.Item>
      ))}
      {error === undefined ? null : (
        <RadioGroup.Error>{error}</RadioGroup.Error>
      )}
    </RadioGroup.Root>
  );
}

export function VatRegistrationField({
  error,
  invalid,
  label,
  onBlur,
  onChange,
  value,
}: Readonly<{
  error: ReactNode;
  invalid: boolean;
  label: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  value: string;
}>) {
  return (
    <TextField.Root invalid={invalid} onChange={onChange} value={value}>
      <TextField.Label>{label}</TextField.Label>
      <TextField.Input maxLength={vatRegistrationMaxLength} onBlur={onBlur} />
      <TextField.Error>{error}</TextField.Error>
    </TextField.Root>
  );
}

export function PercentageField({
  error,
  invalid,
  label,
  onBlur,
  onChange,
  value,
}: Readonly<{
  error: ReactNode;
  invalid: boolean;
  label: string;
  onBlur: () => void;
  onChange: (value: number | null) => void;
  value: number | null;
}>) {
  return (
    <NumberField.Root
      formatOptions={{ maximumFractionDigits: 2, style: 'percent' }}
      invalid={invalid}
      min={0}
      onChange={(nextValue) =>
        onChange(nextValue === null ? null : nextValue * 100)
      }
      required
      step={0.0001}
      value={value === null ? null : value / 100}
    >
      <NumberField.Label>{label}</NumberField.Label>
      <NumberField.Group>
        <NumberField.Input onBlur={onBlur} />
      </NumberField.Group>
      <NumberField.Error>{error}</NumberField.Error>
    </NumberField.Root>
  );
}

export function YearEndFields({
  day,
  dayError,
  dayInvalid,
  dayLabel,
  month,
  monthLabel,
  months,
  onDayBlur,
  onDayChange,
  onMonthChange,
}: Readonly<{
  day: number | null;
  dayError: ReactNode;
  dayInvalid: boolean;
  dayLabel: string;
  month: number;
  monthLabel: string;
  months: ReadonlyArray<string>;
  onDayBlur: () => void;
  onDayChange: (day: number | null) => void;
  onMonthChange: (month: number) => void;
}>) {
  const maximumDay = maximumYearEndDay(month);

  return (
    <Grid columns={{ base: 1, sm: 2 }}>
      <NumberField.Root
        invalid={dayInvalid}
        max={maximumDay}
        min={1}
        onChange={onDayChange}
        required
        step={1}
        value={day}
      >
        <NumberField.Label>{dayLabel}</NumberField.Label>
        <NumberField.Group>
          <NumberField.Input onBlur={onDayBlur} />
        </NumberField.Group>
        <NumberField.Error>{dayError}</NumberField.Error>
      </NumberField.Root>
      <Select.Root
        onChange={(value) => onMonthChange(Number(value))}
        value={month.toString()}
      >
        <Select.Label>{monthLabel}</Select.Label>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Popover>
          <Select.ListBox>
            {months.map((value, index) => (
              <Select.Item id={index.toString()} key={value} textValue={value}>
                {value}
              </Select.Item>
            ))}
          </Select.ListBox>
        </Select.Popover>
      </Select.Root>
    </Grid>
  );
}
