import 'aws-sdk-client-mock-vitest/extend';

vi.mock('@motech-development/node-logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('uuid');
