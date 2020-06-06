/* eslint-disable no-underscore-dangle */
const childProcess = jest.genMockFromModule<{
  exec: jest.Mock;
  setExec(success: boolean): void;
}>('child_process');

let result: (Error | string | undefined)[] = [undefined, 'true', undefined];

childProcess.setExec = (success: boolean) => {
  result = success
    ? [undefined, 'true', undefined]
    : [new Error(), undefined, 'false'];
};

childProcess.exec = jest.fn((_, callback) => callback(...result));

module.exports = childProcess;
