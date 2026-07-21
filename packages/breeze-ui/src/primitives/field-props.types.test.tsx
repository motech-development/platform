import { describe, expectTypeOf, it } from 'vitest';
import type {
  ComboBoxGroupProps,
  ComboBoxTriggerProps,
} from './ComboBox/ComboBox';
import type {
  DropZoneDescriptionProps,
  DropZoneErrorProps,
} from './DropZone/DropZone';
import type {
  FieldsetDescriptionProps,
  FieldsetErrorProps,
  FieldsetRootProps,
} from './Fieldset/Fieldset';
import type { InputGroupRootProps } from './InputGroup/InputGroup';
import type { NumberFieldRootProps } from './NumberField/NumberField';
import type {
  SearchFieldClearButtonProps,
  SearchFieldGroupProps,
  SearchFieldRootProps,
} from './SearchField/SearchField';
import type { TextAreaRootProps } from './TextArea/TextArea';
import type {
  TextFieldInputProps,
  TextFieldRootProps,
} from './TextField/TextField';

describe('field public prop contracts', () => {
  it('accepts only valid controlled, uncontrolled, and read-only text state', () => {
    expectTypeOf<{
      children: null;
      onChange: (value: string) => void;
      value: string;
    }>().toMatchTypeOf<TextFieldRootProps>();
    expectTypeOf<{
      children: null;
      defaultValue: string;
      onChange: (value: string) => void;
    }>().toMatchTypeOf<TextAreaRootProps>();
    expectTypeOf<{
      children: null;
      readOnly: true;
      value: string;
    }>().toMatchTypeOf<SearchFieldRootProps>();
    expectTypeOf<{
      children: null;
      value: string;
    }>().not.toMatchTypeOf<TextFieldRootProps>();
    expectTypeOf<{
      children: null;
      defaultValue: string;
      onChange: (value: string) => void;
      value: string;
    }>().not.toMatchTypeOf<TextFieldRootProps>();
  });

  it('accepts semantic nullable numeric state without mixed ownership', () => {
    expectTypeOf<{
      children: null;
      onChange: (value: number | null) => void;
      value: number | null;
    }>().toMatchTypeOf<NumberFieldRootProps>();
    expectTypeOf<{
      children: null;
      readOnly: true;
      value: number | null;
    }>().toMatchTypeOf<NumberFieldRootProps>();
    expectTypeOf<{
      children: null;
      value: number;
    }>().not.toMatchTypeOf<NumberFieldRootProps>();
    expectTypeOf<{
      children: null;
      defaultValue: number;
      onChange: (value: number | null) => void;
      value: number;
    }>().not.toMatchTypeOf<NumberFieldRootProps>();
  });

  it('keeps React Aria and conflicting DOM state props sealed', () => {
    expectTypeOf<TextFieldRootProps>().not.toHaveProperty('isDisabled');
    expectTypeOf<TextFieldRootProps>().not.toHaveProperty('isInvalid');
    expectTypeOf<TextFieldRootProps>().not.toHaveProperty('isReadOnly');
    expectTypeOf<TextFieldRootProps>().not.toHaveProperty('validationBehavior');
    expectTypeOf<TextFieldInputProps>().not.toHaveProperty('value');
    expectTypeOf<TextFieldInputProps>().not.toHaveProperty('onChange');
    expectTypeOf<InputGroupRootProps>().not.toHaveProperty('style');
    expectTypeOf<FieldsetRootProps>().not.toHaveProperty('style');
    expectTypeOf<FieldsetDescriptionProps>().not.toHaveProperty('id');
    expectTypeOf<FieldsetErrorProps>().not.toHaveProperty('id');
    expectTypeOf<DropZoneDescriptionProps>().not.toHaveProperty('id');
    expectTypeOf<DropZoneErrorProps>().not.toHaveProperty('id');
  });

  it('retains relevant native field and input attributes', () => {
    expectTypeOf<{
      autoComplete: string;
      form: string;
      id: string;
      inputMode: 'decimal';
      name: string;
      placeholder: string;
    }>().toMatchTypeOf<TextFieldInputProps>();
    expectTypeOf<{
      children: null;
      disabled: true;
      form: string;
      name: string;
    }>().toMatchTypeOf<FieldsetRootProps>();
  });

  it('coordinates SearchField composition through one public group size', () => {
    expectTypeOf<{
      children: null;
      size: 'lg';
    }>().toMatchTypeOf<SearchFieldGroupProps>();
    expectTypeOf<{
      'aria-label': string;
      size: 'sm';
    }>().toMatchTypeOf<SearchFieldClearButtonProps>();
    expectTypeOf<SearchFieldGroupProps>().not.toHaveProperty('style');
    expectTypeOf<SearchFieldClearButtonProps>().not.toHaveProperty('style');
  });

  it('coordinates ComboBox composition through one public group size', () => {
    expectTypeOf<{
      children: null;
      size: 'lg';
    }>().toMatchTypeOf<ComboBoxGroupProps>();
    expectTypeOf<{
      size: 'sm';
    }>().toMatchTypeOf<ComboBoxTriggerProps>();
    expectTypeOf<ComboBoxGroupProps>().not.toHaveProperty('style');
    expectTypeOf<ComboBoxTriggerProps>().not.toHaveProperty('style');
  });
});
