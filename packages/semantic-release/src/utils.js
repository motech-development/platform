exports.branches = ['main', 'next'];

exports.plugins = {
  commitAnalyzer: '@semantic-release/commit-analyzer',
  github: [
    '@semantic-release/github',
    {
      failComment: false,
      labels: false,
      successComment: false,
    },
  ],
  npm: (isPackage = false) =>
    isPackage
      ? '@semantic-release/npm'
      : [
          '@semantic-release/npm',
          {
            npmPublish: false,
          },
        ],
  releaseNotesGenerator: '@semantic-release/release-notes-generator',
};
