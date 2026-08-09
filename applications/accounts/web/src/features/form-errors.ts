interface SchemaValidationIssue {
  readonly message: string;
  readonly path: readonly PropertyKey[];
}

interface SafeParseSchema {
  safeParse(value: unknown):
    | { success: true }
    | {
        error: { issues: readonly SchemaValidationIssue[] };
        success: false;
      };
}

function schemaFieldPath(path: readonly PropertyKey[]): string {
  return path.reduce<string>((fieldPath, segment) => {
    if (typeof segment === 'number') return `${fieldPath}[${segment}]`;

    return `${fieldPath ? `${fieldPath}.` : ''}${String(segment)}`;
  }, '');
}

export function schemaFieldErrors(
  schema: SafeParseSchema,
  values: unknown,
  fieldPath: string,
): readonly SchemaValidationIssue[] {
  const result = schema.safeParse(values);

  if (result.success) return [];

  return result.error.issues.filter(
    ({ path }) => schemaFieldPath(path) === fieldPath,
  );
}

export function schemaValuesValid(
  schema: SafeParseSchema,
  values: unknown,
): boolean {
  return schema.safeParse(values).success;
}

export function validationMessage(
  errors: readonly unknown[],
  fallback?: string,
): string {
  return [
    ...new Set(
      errors.flatMap((error) => {
        if (typeof error === 'string') {
          return [error];
        }

        if (
          typeof error === 'object' &&
          error !== null &&
          'message' in error &&
          typeof error.message === 'string'
        ) {
          return [error.message];
        }

        return fallback ? [fallback] : [];
      }),
    ),
  ].join(', ');
}

export function visibleValidationErrors(
  errors: readonly unknown[],
  touched: boolean,
  submissionAttempts: number,
): readonly unknown[] {
  return touched || submissionAttempts > 0 ? errors : [];
}
