const createAppAuth = jest.fn().mockReturnValue(
  jest.fn().mockResolvedValue({
    token: 'my-token',
  }),
);

module.exports = {
  createAppAuth,
};
