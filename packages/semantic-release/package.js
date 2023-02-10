const { branches, plugins } = require('./src/utils');

const { commitAnalyzer, github, npm, releaseNotesGenerator } = plugins;

module.exports = {
  branches,
  plugins: [commitAnalyzer, releaseNotesGenerator, npm(true), github],
};
