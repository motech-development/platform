const { branches, plugins } = require('../utils');

describe('utils', () => {
  it('should have the correct branches', () => {
    expect(branches).toEqual(['main', 'next']);
  });

  it('should have the correct @semantic-release/commit-analyzer plugin config', () => {
    expect(plugins.commitAnalyzer).toEqual('@semantic-release/commit-analyzer');
  });

  it('should have the correct @semantic-release/github plugin config', () => {
    expect(plugins.github).toEqual([
      '@semantic-release/github',
      {
        failComment: false,
        labels: false,
        successComment: false,
      },
    ]);
  });

  it('should have the correct default @semantic-release/npm plugin config', () => {
    expect(plugins.npm()).toEqual([
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ]);
  });

  it('should have the correct @semantic-release/npm plugin config for applications', () => {
    expect(plugins.npm(false)).toEqual([
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ]);
  });

  it('should have the correct @semantic-release/npm plugin config for packages', () => {
    expect(plugins.npm(true)).toEqual('@semantic-release/npm');
  });

  it('should have the correct @semantic-release/release-notes-generator plugin config', () => {
    expect(plugins.releaseNotesGenerator).toEqual(
      '@semantic-release/release-notes-generator',
    );
  });
});
