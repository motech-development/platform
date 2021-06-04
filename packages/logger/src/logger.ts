import winston from 'winston';
import Transport from 'winston-transport';

const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');

export const opts: winston.transports.ConsoleTransportOptions = {
  log(info, callback) {
    setImmediate(() => (this as Transport).emit('logged', info));

    if (this.stderrLevels && this.stderrLevels[info[LEVEL]]) {
      // eslint-disable-next-line no-console
      console.error(info[MESSAGE]);

      if (callback) {
        callback();
      }

      return;
    }

    // eslint-disable-next-line no-console
    console.log(info[MESSAGE]);

    if (callback) {
      callback();
    }
  },
};

const logger = winston.createLogger({
  transports: [new winston.transports.Console(opts)],
});

export default logger;
