import winston from 'winston';
import logger from '../logger';
import opts from '../opts';

vi.mock('winston', async (importOriginal) => {
  const actualWinston = await importOriginal<
    typeof import('winston') & {
      default: typeof import('winston');
    }
  >();
  const createLogger = vi.fn().mockReturnValue({
    log: vi.fn(),
  });
  const transports = {
    ...actualWinston.transports,
    Console: vi.fn(),
  };

  return {
    ...actualWinston,
    createLogger,
    default: {
      ...actualWinston.default,
      createLogger,
      transports,
    },
    transports,
  };
});

describe('logger', () => {
  it('should configure Winston with the correct config', () => {
    logger.log('info', 'test');

    expect(winston.createLogger).toHaveBeenCalledWith({
      transports: [new winston.transports.Console(opts)],
    });
  });
});
