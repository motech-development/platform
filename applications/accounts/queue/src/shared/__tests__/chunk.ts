import chunk from '../chunk';

describe('chunk', () => {
  let arr: number[];

  beforeEach(() => {
    arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  });

  it('should chunk into blocks of 5', () => {
    expect(chunk(arr, 5)).toEqual([
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
    ]);
  });

  it('should chunk into blocks of 3', () => {
    expect(chunk(arr, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
  });
});
