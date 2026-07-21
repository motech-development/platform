import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { Tag as AriaTag } from 'react-aria-components/TagGroup';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { CollectionKey } from '../../internal/types/collection';

const style = tv({
  base: 'inline-flex min-h-8 items-center border border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] px-3 text-sm outline-none data-[focused]:outline-2 data-[selected]:border-[var(--breeze-primary)] data-[selected]:bg-[var(--breeze-primary-soft)] data-[disabled]:opacity-45',
});
/** Props for one keyed tag. */ export interface TagProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'onClick' | 'style'> {
  /** Visible tag content. */ children: ReactNode;
  /** Prevents focus, selection, actions, and removal. Defaults to `false`. */ disabled?: boolean;
  /** Stable tag key. */ id: CollectionKey;
  /** Called with this tag key when its semantic action is invoked. */ onAction?: (
    key: CollectionKey,
  ) => void;
  /** Ref to the rendered tag. */ ref?: Ref<HTMLDivElement>;
  /** Plain text for accessibility/typeahead. */ textValue: string;
}
/**
 * Renders one keyed, focusable tag for selection, semantic actions, or removal
 * by its containing TagGroup.
 *
 * @summary keyed interactive item for a tag collection
 */
export function Tag({
  className,
  disabled = false,
  id,
  onAction,
  ref,
  ...props
}: TagProps): ReactElement {
  const r = useForwardedRef(ref);
  return createElement(AriaTag, {
    ...props,
    className: style({ class: className }),
    id,
    isDisabled: disabled,
    onAction: onAction ? () => onAction(id) : undefined,
    ref: r,
    textValue: props.textValue,
  } as ComponentProps<typeof AriaTag>);
}
