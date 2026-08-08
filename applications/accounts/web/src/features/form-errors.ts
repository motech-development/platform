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
