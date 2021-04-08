const padNumber = (value: number, pad: number) => {
  const result = value.toString().padStart(pad, '0');

  return result;
};

export default padNumber;
