module.exports = {
  factory: (require) => {
    const { execute } = require('@yarnpkg/shell');

    return {
      hooks: {
        async afterAllInstalled() {
          try {
            await execute('yarn prepare');
          } catch {
            /* empty */
          }
        },
      },
    };
  },
  name: '@motech-development/plugin-prepare',
};
