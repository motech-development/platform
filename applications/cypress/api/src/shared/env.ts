const env = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error('Environment variable not found');
  }

  return value;
};

export default env;
