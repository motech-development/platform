module.exports = {
  factory: (require) => {
    const { execute } = require('@yarnpkg/shell');

    return {
      hooks: {
        async afterAllInstalled() {
          try {
            await execute('yarn prepare');
          } catch (e) { /* empty */ }
        },
      },
    };
  },
  name: '@motech-development/plugin-prepare',
};
