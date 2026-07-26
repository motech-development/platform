import 'aws-sdk-client-mock-vitest/extend';

vi.mock('@motech-development/node-logger', () => ({
  default: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('archiver', () => ({
  default: vi.fn().mockReturnValue({
    append: vi.fn(),
    finalize: vi.fn(),
    on: vi.fn(),
    pipe: vi.fn(),
  }),
}));

vi.mock('json-2-csv', () => ({
  json2csv: vi.fn(),
}));

vi.mock('uuid', () => ({
  v1: vi.fn().mockReturnValue('test-uuid'),
  v4: vi.fn().mockReturnValue('test-uuid'),
}));
