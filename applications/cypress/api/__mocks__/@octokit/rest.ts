const Octokit = jest.fn().mockResolvedValue({
  repos: {
    createCommitStatus: jest.fn(),
  },
});

module.exports = {
  Octokit,
};
