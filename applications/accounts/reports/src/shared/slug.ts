const slug = (value: string) => value.replace(/\s+/g, '-').toLowerCase();

export default slug;
