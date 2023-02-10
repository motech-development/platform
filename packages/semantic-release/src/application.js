const { branches, plugins } = require('./utils');

const { commitAnalyzer, github, npm, releaseNotesGenerator } = plugins;

module.exports = {
  branches,
  plugins: [commitAnalyzer, releaseNotesGenerator, npm(false), github],
};
