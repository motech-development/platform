export function validationMessage(errors: readonly unknown[]) {
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

        return [];
      }),
    ),
  ].join(', ');
}

export function visibleErrors(
  errors: readonly unknown[],
  touched: boolean,
  submissionAttempts: number,
) {
  return touched || submissionAttempts > 0 ? errors : [];
}
