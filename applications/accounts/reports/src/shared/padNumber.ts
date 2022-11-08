const padNumber = (value: number, pad: number): string =>
  value.toString().padStart(pad, '0');

export default padNumber;
