import { describe, expectTypeOf, it } from 'vitest';
import type { CheckboxRootProps } from './Checkbox/Checkbox';
import type { CheckboxGroupRootProps } from './CheckboxGroup/CheckboxGroup';
import type { RadioGroupRootProps } from './RadioGroup/RadioGroup';
import type { SliderRootProps, SliderThumbProps } from './Slider/Slider';
import type { SwitchRootProps } from './Switch/Switch';

describe('selection public prop contracts', () => {
  it('accepts only valid Boolean ownership modes', () => {
    expectTypeOf<{
      children: null;
      onChange: (selected: boolean) => void;
      selected: boolean;
    }>().toMatchTypeOf<CheckboxRootProps>();
    expectTypeOf<{
      children: null;
      defaultSelected: boolean;
    }>().toMatchTypeOf<SwitchRootProps>();
    expectTypeOf<{
      children: null;
      readOnly: true;
      selected: boolean;
    }>().toMatchTypeOf<SwitchRootProps>();
    expectTypeOf<{
      children: null;
      selected: boolean;
    }>().not.toMatchTypeOf<CheckboxRootProps>();
    expectTypeOf<{
      children: null;
      defaultSelected: boolean;
      onChange: (selected: boolean) => void;
      selected: boolean;
    }>().not.toMatchTypeOf<SwitchRootProps>();
  });

  it('accepts only valid group-selection ownership modes', () => {
    expectTypeOf<{
      children: null;
      onSelectionChange: (selection: string[]) => void;
      selection: string[];
    }>().toMatchTypeOf<CheckboxGroupRootProps>();
    expectTypeOf<{
      children: null;
      readOnly: true;
      selection: string | null;
    }>().toMatchTypeOf<RadioGroupRootProps>();
    expectTypeOf<{
      children: null;
      selection: string[];
    }>().not.toMatchTypeOf<CheckboxGroupRootProps>();
    expectTypeOf<{
      children: null;
      defaultSelection: string;
      onSelectionChange: (selection: string) => void;
      selection: string;
    }>().not.toMatchTypeOf<RadioGroupRootProps>();
  });

  it('accepts only valid single-value slider ownership modes', () => {
    expectTypeOf<{
      children: null;
      onChange: (value: number) => void;
      value: number;
    }>().toMatchTypeOf<SliderRootProps>();
    expectTypeOf<{
      children: null;
      defaultValue: number;
    }>().toMatchTypeOf<SliderRootProps>();
    expectTypeOf<{
      children: null;
      readOnly: true;
      value: number;
    }>().toMatchTypeOf<SliderRootProps>();
    expectTypeOf<{
      children: null;
      value: number[];
    }>().not.toMatchTypeOf<SliderRootProps>();
    expectTypeOf<{
      children: null;
      value: number;
    }>().not.toMatchTypeOf<SliderRootProps>();
  });

  it('keeps React Aria and conflicting DOM state props sealed', () => {
    expectTypeOf<CheckboxRootProps>().not.toHaveProperty('isSelected');
    expectTypeOf<CheckboxRootProps>().not.toHaveProperty('isIndeterminate');
    expectTypeOf<CheckboxGroupRootProps>().not.toHaveProperty('isDisabled');
    expectTypeOf<RadioGroupRootProps>().not.toHaveProperty(
      'validationBehavior',
    );
    expectTypeOf<SwitchRootProps>().not.toHaveProperty('isReadOnly');
    expectTypeOf<SliderRootProps>().not.toHaveProperty('minValue');
    expectTypeOf<SliderRootProps>().not.toHaveProperty('maxValue');
    expectTypeOf<SliderRootProps>().not.toHaveProperty('style');
  });

  it('retains deliberate native form attributes and refs', () => {
    expectTypeOf<{
      children: null;
      form: string;
      name: string;
      value: string;
    }>().toMatchTypeOf<CheckboxRootProps>();
    expectTypeOf<{
      form: string;
      name: string;
    }>().toMatchTypeOf<SliderThumbProps>();
  });
});
