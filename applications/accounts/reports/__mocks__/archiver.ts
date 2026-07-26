const Archiver = vi.fn().mockReturnValue({
  append: vi.fn(),
  finalize: vi.fn(),
  on: vi.fn(),
  pipe: vi.fn(),
});

export default Archiver;
