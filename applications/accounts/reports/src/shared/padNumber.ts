const padNumber = (value: number, pad: number) =>
  value.toString().padStart(pad, '0');

export default padNumber;
