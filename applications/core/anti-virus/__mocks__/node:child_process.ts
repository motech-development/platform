const childProcess = jest.genMockFromModule<{
  execFile: jest.Mock;
  setExecFile(success: boolean): void;
}>('node:child_process');

type TResult = (Error | string | undefined)[];

type TCallback = (...result: TResult) => void;

let result: TResult = [undefined, 'true', undefined];

childProcess.setExecFile = (success: boolean) => {
  result = success
    ? [undefined, 'true', undefined]
    : [new Error(), undefined, 'false'];
};

childProcess.execFile = jest.fn((_, __, callback: TCallback) =>
  callback(...result),
);

module.exports = childProcess;
