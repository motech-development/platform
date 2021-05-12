const mock = jest.fn();

const createSignedUrl = mock;

const downloadFileStream = mock;

const uploader = jest.fn().mockReturnValue({
  promise: mock,
});

exports.createSignedUrl = createSignedUrl;

exports.downloadFileStream = downloadFileStream;

exports.uploader = uploader;
