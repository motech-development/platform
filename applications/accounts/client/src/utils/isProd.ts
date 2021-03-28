const isProd = <T>(prod: T, nonProd: T) => {
  if (process.env.NODE_ENV === 'production') {
    return prod;
  }

  return nonProd;
};

export default isProd;
