type RootErrorHandler = (error: unknown, errorInfo: unknown) => void;
type RootOptions = {
  onRecoverableError: RootErrorHandler;
  onUncaughtError: RootErrorHandler;
};

const mocks = vi.hoisted(() => ({
  config: { stage: 'pr-1542' },
  hydrateRoot:
    vi.fn<
      (container: Document, children: unknown, options: RootOptions) => void
    >(),
  initialiseObservability: vi.fn(),
  onRecoverableError: vi.fn<RootErrorHandler>(),
  onUncaughtError: vi.fn<RootErrorHandler>(),
  reactErrorHandler: vi.fn<() => RootErrorHandler>(),
  readAccountsWebConfig: vi.fn(),
}));

vi.mock('@sentry/tanstackstart-react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sentry/tanstackstart-react')>()),
  reactErrorHandler: mocks.reactErrorHandler,
}));

vi.mock('@tanstack/react-start/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-start/client')>()),
  StartClient: () => null,
}));

vi.mock('react-dom/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-dom/client')>()),
  hydrateRoot: mocks.hydrateRoot,
}));

vi.mock('./config', () => ({
  readAccountsWebConfig: mocks.readAccountsWebConfig,
}));

vi.mock('./observability', () => ({
  initialiseObservability: mocks.initialiseObservability,
}));

describe('Accounts web client entry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    mocks.readAccountsWebConfig.mockReturnValue(mocks.config);
    mocks.reactErrorHandler
      .mockReturnValueOnce(mocks.onUncaughtError)
      .mockReturnValueOnce(mocks.onRecoverableError);
  });

  it('reports uncaught and recoverable React root failures', async () => {
    await import('./client');

    expect(mocks.initialiseObservability).toHaveBeenCalledWith(mocks.config);
    expect(mocks.hydrateRoot).toHaveBeenCalledOnce();
    expect(mocks.hydrateRoot.mock.calls[0]?.[0]).toBe(document);
    expect(mocks.reactErrorHandler).toHaveBeenCalledTimes(2);
    expect(mocks.hydrateRoot.mock.calls[0]?.[2].onRecoverableError).toBeTypeOf(
      'function',
    );
    expect(mocks.hydrateRoot.mock.calls[0]?.[2].onUncaughtError).toBeTypeOf(
      'function',
    );
  });
});
