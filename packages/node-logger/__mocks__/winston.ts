const winston = {
  createLogger: vi.fn().mockReturnValue({
    log: vi.fn(),
  }),
  transports: {
    Console: vi.fn(),
  },
};

export default winston;
