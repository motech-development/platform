import { Badge } from '../primitives/Badge/Badge';
import collectionVariants from './collection.styles';
import type { ItemDescriptorBadge } from './item.types';

/** Renders a descriptor badge with the collection pill treatment. */
export default function DescriptorBadge({
  badge,
}: Readonly<{ badge: ItemDescriptorBadge }>) {
  return (
    <>
      {/* Flex layout drops this space, but accessible names keep it. */}{' '}
      <span className={collectionVariants.base.badge}>
        <Badge aria-label={badge['aria-label']} variant={badge.variant}>
          {badge.children}
        </Badge>
      </span>
    </>
  );
}
