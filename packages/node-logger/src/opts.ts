import { transports } from 'winston';
import Transport from 'winston-transport';

export const LEVEL = Symbol.for('level');

export const MESSAGE = Symbol.for('message');

interface IInfo {
  [LEVEL]: string;
  [MESSAGE]: string;
}

const opts: transports.ConsoleTransportOptions = {
  log(info: IInfo, callback) {
    setImmediate(() => (this as Transport).emit('logged', info));

    if (this.stderrLevels && this.stderrLevels[info[LEVEL]]) {
      console.error(info[MESSAGE]);

      if (callback) {
        callback();
      }

      return;
    }

    console.log(info[MESSAGE]);

    if (callback) {
      callback();
    }
  },
};

export default opts;
