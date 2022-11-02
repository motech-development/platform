import winston from 'winston';
import logger from '../logger';
import opts from '../opts';

describe('logger', () => {
  it('should configure Winston with the correct config', () => {
    logger.log('info', 'test');

    expect(winston.createLogger).toHaveBeenCalledWith({
      transports: [new winston.transports.Console(opts)],
    });
  });
});
