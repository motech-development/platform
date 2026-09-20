import { ListBoxItem as AriaListBoxItem } from 'react-aria-components/ListBox';
import collectionVariants from './collection.styles';
import DescriptorContent from './DescriptorContent';
import type { ItemDescriptor } from './item.types';

/** Renders Breeze's closed descriptor contract inside a React Aria option. */
function DescriptorOption({
  descriptor,
}: Readonly<{ descriptor: ItemDescriptor }>) {
  return (
    <AriaListBoxItem
      className={collectionVariants.base.item}
      id={descriptor.id}
      isDisabled={descriptor.disabled}
      textValue={descriptor.label}
    >
      {({ isSelected }) => (
        <DescriptorContent descriptor={descriptor} isSelected={isSelected} />
      )}
    </AriaListBoxItem>
  );
}

export default DescriptorOption;
