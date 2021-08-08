const childProcess =
  jest.genMockFromModule<{
    execFile: jest.Mock;
    setExecFile(success: boolean): void;
  }>('child_process');

let result: (Error | string | undefined)[] = [undefined, 'true', undefined];

childProcess.setExecFile = (success: boolean) => {
  result = success
    ? [undefined, 'true', undefined]
    : [new Error(), undefined, 'false'];
};

childProcess.execFile = jest.fn((_, __, callback) => callback(...result));

module.exports = childProcess;
