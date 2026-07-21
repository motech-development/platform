/** Breakpoints available to Breeze responsive layout props. */
export type BreezeBreakpoint = 'base' | 'sm' | 'md' | 'lg';

/**
 * A mobile-first layout value with required base behaviour and optional
 * overrides at Breeze breakpoints.
 */
export interface ResponsiveValueObject<Value> {
  /** Value used below the first breakpoint and inherited until overridden. */
  base: Value;
  /** Value applied at 1181px and wider. */
  lg?: Value;
  /** Value applied at 901px and wider. */
  md?: Value;
  /** Value applied at 681px and wider. */
  sm?: Value;
}

/** A scalar layout value or mobile-first responsive value. */
export type ResponsiveValue<Value> = Value | ResponsiveValueObject<Value>;

type ResponsiveClassMap<Value extends PropertyKey> = Record<
  BreezeBreakpoint,
  Record<Value, string>
>;

const breakpoints: BreezeBreakpoint[] = ['base', 'sm', 'md', 'lg'];

function isResponsiveValue<Value>(
  value: ResponsiveValue<Value>,
): value is ResponsiveValueObject<Value> {
  return typeof value === 'object' && value !== null && 'base' in value;
}

export function resolveResponsiveClasses<Value extends PropertyKey>(
  value: ResponsiveValue<Value>,
  classes: ResponsiveClassMap<Value>,
): string {
  if (!isResponsiveValue(value)) {
    return classes.base[value];
  }

  return breakpoints
    .map((breakpoint) => {
      const breakpointValue = value[breakpoint];

      return breakpointValue === undefined
        ? undefined
        : classes[breakpoint][breakpointValue];
    })
    .filter((className): className is string => className !== undefined)
    .join(' ');
}
