function chunk<T>(arr: T[], size: number) {
  return Array.from(
    {
      length: Math.ceil(arr.length / size),
    },
    (_, index) => arr.slice(index * size, index * size + size),
  );
}

export default chunk;
