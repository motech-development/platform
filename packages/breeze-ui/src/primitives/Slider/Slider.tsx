import type {
  ComponentProps,
  HTMLAttributes,
  OutputHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import {
  createContext,
  createElement,
  useContext,
  useId,
  useMemo,
  useRef,
} from 'react';
import {
  Slider as AriaSlider,
  SliderFill as AriaSliderFill,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
} from 'react-aria-components/Slider';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { ControlSize } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';
import { TextField, type TextFieldLabelProps } from '../TextField/TextField';

const sliderRoot = tv({
  base: 'flex min-w-0 gap-2 data-[disabled]:opacity-65',
  defaultVariants: {
    orientation: 'horizontal',
  },
  variants: {
    orientation: {
      horizontal: 'w-full flex-col',
      vertical:
        'grid w-fit grid-cols-[minmax(0,1fr)_auto] items-start [&>[data-breeze-slider-description]]:col-span-2 [&>[data-breeze-slider-error]]:col-span-2 [&>[data-breeze-slider-label]]:col-start-1 [&>[data-breeze-slider-output]]:col-start-2 [&>[data-breeze-slider-track]]:col-span-2 [&>[data-breeze-slider-track]]:justify-self-center',
    },
  },
});

const sliderOutput = tv({
  base: 'font-[family-name:var(--breeze-font-display)] text-sm font-bold tabular-nums text-[var(--breeze-ink)]',
});

const sliderTrack = tv({
  base: 'relative rounded-full bg-[var(--breeze-border)] data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:my-3 data-[orientation=vertical]:h-64 data-[orientation=vertical]:w-2',
});

const sliderFill = tv({
  base: 'absolute rounded-full bg-[var(--breeze-primary)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
});

const sliderThumb = tv({
  base: 'left-1/2 top-1/2 rounded-full border-2 border-[var(--breeze-primary)] bg-[var(--breeze-surface)] shadow-sm transition-transform duration-[var(--breeze-duration-fast)] data-[dragging]:scale-110 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)] data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:-translate-y-1/2 data-[orientation=vertical]:-translate-x-1/2',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-7',
      md: 'size-6',
      sm: 'size-5',
    },
  },
});

const sliderDescription = tv({
  base: 'text-sm text-[var(--breeze-ink-soft)]',
});

const sliderError = tv({
  base: 'text-sm font-medium text-[var(--breeze-danger)]',
});

interface SliderContextValue {
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  readOnly: boolean;
  required: boolean;
}

const SliderContext = createContext<SliderContextValue | null>(null);

function useSliderContext(): SliderContextValue {
  const context = useContext(SliderContext);

  if (context === null) {
    throw new globalThis.Error(
      'Slider parts must be rendered within Slider.Root.',
    );
  }

  return context;
}

type SliderRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface SliderRootSharedProps extends SliderRootNativeProps {
  /** Compound label, output, track, fill, thumb, description, and error parts. */
  children: ReactNode;
  /** Prevents focus, dragging, and value changes. Defaults to `false`. */
  disabled?: boolean;
  /** Locale-aware number formatting options. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Exposes invalid state to the thumb input and error styling. Defaults to `false`. */
  invalid?: boolean;
  /** Largest permitted value. Defaults to `100`. */
  max?: number;
  /** Smallest permitted value. Defaults to `0`. */
  min?: number;
  /** Track and keyboard direction. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Called with the final value after a drag or keyboard sequence ends. */
  onChangeEnd?: (value: number) => void;
  /** Marks the native range input as required. Defaults to `false`. */
  required?: boolean;
  /** Ref to the rendered slider group. */
  ref?: Ref<HTMLDivElement>;
  /** Keyboard and drag increment. Defaults to `1`. */
  step?: number;
}

interface ControlledSliderRootProps {
  /** Current slider value. */
  value: number;
  /** Called with the next slider value. */
  onChange: (value: number) => void;
  defaultValue?: never;
  readOnly?: false;
}

interface ReadOnlySliderRootProps {
  /** Current immutable slider value. */
  value: number;
  /** Marks a controlled value as intentionally immutable and non-interactive. */
  readOnly: true;
  defaultValue?: never;
  onChange?: never;
}

interface UncontrolledSliderRootProps {
  /** Initial slider value. Defaults to the minimum value. */
  defaultValue?: number;
  /** Called with the next slider value. */
  onChange?: (value: number) => void;
  readOnly?: false;
  value?: never;
}

/** Props for controlled, read-only, or uncontrolled single-value slider state. */
export type SliderRootProps = SliderRootSharedProps &
  (
    | ControlledSliderRootProps
    | ReadOnlySliderRootProps
    | UncontrolledSliderRootProps
  );

/** Props for the visible slider label. */
export type SliderLabelProps = TextFieldLabelProps;

/** Props for the locale-formatted slider output. */
export interface SliderOutputProps
  extends Omit<OutputHTMLAttributes<HTMLOutputElement>, 'style'> {
  /** Optional custom output content. Defaults to the formatted current value. */
  children?: ReactNode;
  /** Ref to the rendered output. */
  ref?: Ref<HTMLOutputElement>;
}

/** Props for the interactive slider track. */
export interface SliderTrackProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Fill and thumb parts. */
  children: ReactNode;
  /** Ref to the rendered track. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for the selected-value track fill. */
export interface SliderFillProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  /** Ref to the rendered fill. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for the draggable slider thumb and hidden native range input. */
export interface SliderThumbProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  /** Accessible thumb name when the root label is insufficient. */
  'aria-label'?: string;
  /** Associates the hidden range input with additional guidance. */
  'aria-describedby'?: string;
  /** Associates the hidden native range input with an external form. */
  form?: string;
  /** Ref to the hidden native range input used for focus and form integration. */
  inputRef?: RefObject<HTMLInputElement | null>;
  /** Native form field name. */
  name?: string;
  /** Ref to the rendered draggable thumb. */
  ref?: Ref<HTMLDivElement>;
  /** Canonical thumb size. Defaults to `md`. */
  size?: ControlSize;
}

/** Props for supporting text associated with the slider thumb. */
export interface SliderDescriptionProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'style'> {
  /** Supporting guidance for the slider. */
  children: ReactNode;
  /** Ref to the rendered description. */
  ref?: Ref<HTMLParagraphElement>;
}

/** Props for an accessible slider validation message. */
export interface SliderErrorProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'style'> {
  /** Validation message for the slider. */
  children: ReactNode;
  /** Ref to the rendered error message. */
  ref?: Ref<HTMLParagraphElement>;
}

/** Coordinates a locale-aware, single-value slider and its compound anatomy. */
export function Root({
  children,
  className,
  defaultValue,
  disabled = false,
  formatOptions,
  invalid = false,
  max,
  min,
  onChange,
  onChangeEnd,
  orientation = 'horizontal',
  readOnly = false,
  ref,
  required = false,
  step,
  value,
  ...props
}: SliderRootProps): ReactElement {
  useBreezeContext();

  const generatedId = useId();
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;
  const forwardedRef = useForwardedRef(ref);
  const contextValue = useMemo(
    () => ({ descriptionId, errorId, invalid, readOnly, required }),
    [descriptionId, errorId, invalid, readOnly, required],
  );

  return createElement(
    SliderContext.Provider,
    { value: contextValue },
    createElement(
      AriaSlider,
      {
        ...props,
        className: sliderRoot({ class: className, orientation }),
        defaultValue,
        formatOptions,
        isDisabled: disabled,
        maxValue: max,
        minValue: min,
        onChange,
        onChangeEnd,
        orientation,
        ref: forwardedRef,
        step,
        value,
      } as ComponentProps<typeof AriaSlider>,
      children,
    ),
  );
}

/** Renders the locale-formatted current Slider value. */
export function Output({
  className,
  ref,
  ...props
}: SliderOutputProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaSliderOutput, {
    ...props,
    className: sliderOutput({ class: className }),
    'data-breeze-slider-output': true,
    ref: forwardedRef,
  } as SliderOutputProps & { 'data-breeze-slider-output': true });
}

/** Renders the pointer and touch interaction surface for a Slider. */
export function Track({
  className,
  ref,
  ...props
}: SliderTrackProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaSliderTrack, {
    ...props,
    className: sliderTrack({ class: className }),
    'data-breeze-slider-track': true,
    ref: forwardedRef,
  } as SliderTrackProps & { 'data-breeze-slider-track': true });
}

/** Renders the persistent accessible label owned by the Slider. */
export function Label(props: SliderLabelProps): ReactElement {
  return createElement(TextField.Label, {
    ...props,
    'data-breeze-slider-label': true,
  } as SliderLabelProps & { 'data-breeze-slider-label': true });
}

/** Renders the selected portion of a Slider track. */
export function Fill({
  className,
  ref,
  ...props
}: SliderFillProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaSliderFill, {
    ...props,
    className: sliderFill({ class: className }),
    ref: forwardedRef,
  });
}

/** Renders the draggable Slider thumb and hidden native range input. */
export function Thumb({
  'aria-describedby': ariaDescribedBy,
  className,
  inputRef,
  ref,
  size,
  ...props
}: SliderThumbProps): ReactElement {
  const { descriptionId, errorId, invalid, readOnly, required } =
    useSliderContext();
  const forwardedRef = useForwardedRef(ref);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const describedBy = [
    ariaDescribedBy,
    descriptionId,
    invalid ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return createElement(AriaSliderThumb, {
    ...props,
    'aria-describedby': describedBy,
    className: sliderThumb({ class: className, size }),
    inputRef: inputRef ?? fallbackInputRef,
    isDisabled: readOnly,
    isInvalid: invalid,
    isRequired: required,
    ref: forwardedRef,
  } as ComponentProps<typeof AriaSliderThumb>);
}

/** Renders supporting guidance associated with a Slider thumb. */
export function Description({
  className,
  id,
  ref,
  ...props
}: SliderDescriptionProps): ReactElement {
  const { descriptionId } = useSliderContext();
  const forwardedRef = useForwardedRef(ref);

  return createElement('p', {
    ...props,
    className: sliderDescription({ class: className }),
    'data-breeze-slider-description': true,
    id: id ?? descriptionId,
    ref: forwardedRef,
  });
}

/** Renders a validation message associated with an invalid Slider thumb. */
function ErrorMessage({
  className,
  id,
  ref,
  ...props
}: SliderErrorProps): ReactElement {
  const { errorId } = useSliderContext();
  const forwardedRef = useForwardedRef(ref);

  return createElement('p', {
    ...props,
    className: sliderError({ class: className }),
    'data-breeze-slider-error': true,
    id: id ?? errorId,
    ref: forwardedRef,
  });
}

export { ErrorMessage as Error };

/**
 * Coordinates a labelled, locale-aware single-value range with explicit
 * track, fill, thumb, output, description, and validation parts.
 *
 * @summary accessible compound single-value range input
 */
export const Slider = {
  /** Supporting guidance associated with the thumb. */
  Description,
  /** Validation message associated with an invalid thumb. */
  Error: ErrorMessage,
  /** Selected portion of the track. */
  Fill,
  /** Persistent accessible label. */
  Label,
  /** Locale-formatted current value. */
  Output,
  /** State, constraints, orientation, and accessibility root. */
  Root,
  /** Draggable thumb and hidden native range input. */
  Thumb,
  /** Pointer and touch interaction surface. */
  Track,
};
