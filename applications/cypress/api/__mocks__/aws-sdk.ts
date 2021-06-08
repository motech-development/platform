import { SSM } from 'aws-sdk';

SSM.prototype.getParameter = jest.fn().mockReturnValue({
  promise: jest.fn(),
});

module.exports = {
  SSM,
};
