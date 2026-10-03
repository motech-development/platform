import { Icon } from '../primitives/Icon/Icon';
import collectionVariants from './collection.styles';
import DescriptorBadge from './DescriptorBadge';
import type { ItemDescriptor } from './item.types';

interface DescriptorContentProps {
  descriptor: ItemDescriptor;
  isSelected: boolean;
}

/** Renders the closed descriptor content shared by collection controls. */
export default function DescriptorContent({
  descriptor,
  isSelected,
}: Readonly<DescriptorContentProps>) {
  return (
    <>
      {descriptor.icon && <Icon name={descriptor.icon} size="sm" />}
      <span className={collectionVariants.base.content}>
        <span>{descriptor.label}</span>
        {descriptor.description && (
          <span className={collectionVariants.base.description}>
            {descriptor.description}
          </span>
        )}
      </span>
      {descriptor.badge && <DescriptorBadge badge={descriptor.badge} />}
      {isSelected && (
        <span
          aria-hidden="true"
          className={collectionVariants.base.selectedIndicator}
        >
          <Icon name="check" size="sm" />
        </span>
      )}
    </>
  );
}
