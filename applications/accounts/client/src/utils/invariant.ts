function invariant(value: unknown): asserts value {
  if (!value) {
    throw new Error('Invariant violation');
  }
}

export default invariant;
