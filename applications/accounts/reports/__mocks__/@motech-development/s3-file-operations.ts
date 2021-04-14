const mock = jest.fn();

const downloadFileStream = mock;

const uploader = jest.fn().mockReturnValue({
  promise: mock,
});

exports.downloadFileStream = downloadFileStream;

exports.uploader = uploader;
