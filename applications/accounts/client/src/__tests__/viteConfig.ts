import type { UserConfigFnObject } from 'vite';

describe('vite config', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = {
      ...process.env,
    };
  });

  afterEach(() => {
    process.env = env;
  });

  it('should only expose client variables to the bundle', async () => {
    process.env.REACT_APP_EXPOSED = 'exposed';
    process.env.NOT_EXPOSED = 'hidden';

    // Loaded at runtime as the config belongs to the tsconfig.node.json project
    const { default: viteConfig } = await vi.importActual<{
      default: UserConfigFnObject;
    }>('../../vite.config.mts');
    const { define } = viteConfig({
      command: 'build',
      mode: 'production',
    });

    expect(define?.['process.env']).toContain('REACT_APP_EXPOSED');
    expect(define?.['process.env']).not.toContain('NOT_EXPOSED');
  });
});
