import Transport from 'winston-transport';
import opts, { LEVEL, MESSAGE } from '../opts';

const levels = {
  alert: 1,
  crit: 2,
  debug: 7,
  emerg: 0,
  error: 3,
  info: 6,
  notice: 5,
  warning: 4,
};

describe('opts', () => {
  let callback: jest.Mock;

  beforeEach(() => {
    callback = jest.fn();

    opts.stderrLevels = ['emerg', 'alert', 'crit', 'error'];
    (opts as Transport).emit = jest.fn();

    console.error = jest.fn();
    console.log = jest.fn();
  });

  it('should log the correct non-error message when a callback is defined', () => {
    opts.log(
      {
        [LEVEL]: levels.info,
        [MESSAGE]: 'My message',
      },
      callback,
    );

    expect(console.log).toHaveBeenLastCalledWith('My message');
    expect(callback).toHaveBeenCalled();
  });

  it('should log the correct non-error message when a callback is not defined', () => {
    opts.log(
      {
        [LEVEL]: levels.info,
        [MESSAGE]: 'My message',
      },
      undefined,
    );

    expect(console.log).toHaveBeenLastCalledWith('My message');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should log the correct error message when a callback is defined', () => {
    opts.log(
      {
        [LEVEL]: levels.error,
        [MESSAGE]: 'My message',
      },
      callback,
    );

    expect(console.error).toHaveBeenLastCalledWith('My message');
    expect(callback).toHaveBeenCalled();
  });

  it('should log the correct error message when a callback is not defined', () => {
    opts.log(
      {
        [LEVEL]: levels.error,
        [MESSAGE]: 'My message',
      },
      undefined,
    );

    expect(console.error).toHaveBeenLastCalledWith('My message');
    expect(callback).not.toHaveBeenCalled();
  });
});
