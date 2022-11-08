const slug = (value: string): string =>
  value.replace(/\s+/g, '-').toLowerCase();

export default slug;
