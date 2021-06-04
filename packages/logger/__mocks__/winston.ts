const winston =
  jest.genMockFromModule<{
    createLogger: jest.Mock;
    transports: {
      Console: jest.Mock;
    };
  }>('winston');

winston.createLogger = jest.fn().mockReturnValue({
  log: jest.fn(),
});

winston.transports.Console = jest.fn();

module.exports = winston;
