import winston from 'winston';
import opts from './opts';

const logger = winston.createLogger({
  transports: [new winston.transports.Console(opts)],
});

export default logger;
