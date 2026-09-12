import type { ReactNode } from 'react';
import { Children, Fragment, isValidElement } from 'react';

function flattenLayoutChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    ) {
      return flattenLayoutChildren(child.props.children);
    }

    return child;
  });
}

export default flattenLayoutChildren;
