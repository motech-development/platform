const Archiver = jest.fn().mockReturnValue({
  append: jest.fn(),
  finalize: jest.fn(),
  on: jest.fn(),
  pipe: jest.fn(),
});

module.exports = Archiver;
