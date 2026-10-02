interface LayoutAccessibility {
  accessibleLabel?: string;
  role?: 'group';
}

function getLayoutAccessibility(
  ariaLabel: string | undefined,
  element: string,
): LayoutAccessibility {
  const accessibleLabel = ariaLabel?.trim() || undefined;

  return {
    accessibleLabel,
    role:
      accessibleLabel !== undefined && element === 'div' ? 'group' : undefined,
  };
}

export default getLayoutAccessibility;
