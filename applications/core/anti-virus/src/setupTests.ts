import 'aws-sdk-client-mock-vitest/extend';

vi.mock('@motech-development/node-logger', () => ({
  default: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));
