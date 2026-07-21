import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import {
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
} from 'react-aria-components/TagGroup';
import { tv } from 'tailwind-variants';
import useCollectionEmptyContent from '../../internal/collections/useCollectionEmptyContent';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type {
  BreezeCollectionItem,
  CollectionContentProps,
  CollectionKey,
  CollectionSelection,
} from '../../internal/types/collection';
import { useBreezeContext } from '../../provider/BreezeContext';
import {
  TextField,
  type TextFieldDescriptionProps,
  type TextFieldLabelProps,
} from '../TextField/TextField';

const root = tv({ base: 'flex min-w-0 flex-col gap-2' });
const list = tv({ base: 'flex flex-wrap gap-2 outline-none' });
interface Shared
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'onChange' | 'style'
  > {
  /** Compound label, tag list, and supporting guidance parts. */ children: ReactNode;
  /** Keys whose tags cannot receive focus, selection, actions, or removal. */ disabledKeys?: Iterable<CollectionKey>;
  /** Called with the stable keys removed through keyboard interaction. */ onRemove?: (
    keys: CollectionKey[],
  ) => void;
  /** Ref to the rendered tag-group root. */ ref?: Ref<HTMLDivElement>;
}
type State =
  | {
      /** Current selected tag keys, or every key for select-all state. */
      selection: CollectionSelection;
      /** Called with the next selected tag keys. */
      onSelectionChange: (selection: CollectionSelection) => void;
      /** Excluded when selection is controlled. */
      defaultSelection?: never;
      /** Controlled mutable state cannot be marked read-only. */
      readOnly?: false;
    }
  | {
      /** Current immutable selected tag keys. */
      selection: CollectionSelection;
      /** Prevents selection changes and removal. */
      readOnly: true;
      /** Excluded because read-only selection cannot change. */
      onSelectionChange?: never;
      /** Excluded when selection is controlled. */
      defaultSelection?: never;
    }
  | {
      /** Initial selected tag keys. */
      defaultSelection?: CollectionSelection;
      /** Called with the next selected tag keys. */
      onSelectionChange?: (selection: CollectionSelection) => void;
      /** Excluded when selection is uncontrolled. */
      selection?: never;
      /** Uncontrolled state cannot be marked read-only. */
      readOnly?: false;
    };
/** Tag-group selection and removal props. */ export type TagGroupRootProps =
  Shared & State;
/** Props for the visible tag-group label. */ export type TagGroupLabelProps =
  TextFieldLabelProps;
/** Props for supporting tag-group guidance. */ export type TagGroupDescriptionProps =
  TextFieldDescriptionProps;
/** Static or generic tag list props. */ export type TagGroupListProps<
  Item extends BreezeCollectionItem = BreezeCollectionItem,
> = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> &
  CollectionContentProps<Item> & {
    /** Content displayed when the tag collection has no items. */ emptyContent?: ReactNode;
    /** Ref to the rendered tag-list element. */ ref?: Ref<HTMLDivElement>;
  };
const normalise = (value: 'all' | Set<CollectionKey>): CollectionSelection =>
  value === 'all' ? 'all' : [...value];
/** Coordinates tag selection, focus, and removal. */ export function Root({
  children,
  className,
  defaultSelection,
  disabledKeys,
  onRemove,
  onSelectionChange,
  readOnly = false,
  ref,
  selection,
  ...props
}: Readonly<TagGroupRootProps>): ReactElement {
  useBreezeContext();
  const r = useForwardedRef(ref);
  return createElement(AriaTagGroup, {
    ...props,
    children,
    className: root({ class: className }),
    defaultSelectedKeys: defaultSelection,
    disabledKeys,
    onRemove:
      readOnly || !onRemove
        ? undefined
        : (keys: Set<CollectionKey>) => onRemove([...keys]),
    onSelectionChange: readOnly
      ? undefined
      : (keys: 'all' | Set<CollectionKey>) =>
          onSelectionChange?.(normalise(keys)),
    ref: r,
    selectedKeys: selection,
    selectionMode:
      selection !== undefined ||
      defaultSelection !== undefined ||
      onSelectionChange !== undefined
        ? 'multiple'
        : 'none',
  } as unknown as ComponentProps<typeof AriaTagGroup>);
}
/** Renders static or typed generic tags. */ export function List<
  Item extends BreezeCollectionItem,
>({
  children,
  className,
  emptyContent,
  items,
  ref,
  ...props
}: Readonly<TagGroupListProps<Item>>): ReactElement {
  const r = useForwardedRef(ref);
  const resolvedEmptyContent = useCollectionEmptyContent(emptyContent);

  return createElement(AriaTagList, {
    ...props,
    children,
    className: list({ class: className }),
    items,
    ref: r,
    renderEmptyState: () => resolvedEmptyContent,
  } as unknown as ComponentProps<typeof AriaTagList>);
}
/**
 * Coordinates a labelled static or generic tag collection with optional
 * multiple selection, disabled keys, and application-owned removal.
 *
 * @summary accessible selectable and removable tag collection
 */
export const TagGroup = {
  /** Supporting guidance associated with the tag group. */ Description:
    TextField.Description,
  /** Visible label associated with the tag list. */ Label: TextField.Label,
  /** Static or typed generic tag collection. */ List,
  /** Selection, focus, and removal coordination root. */ Root,
};
