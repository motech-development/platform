module.exports = {
  factory: (require) => {
    const { execute } = require('@yarnpkg/shell');

    return {
      hooks: {
        async afterAllInstalled() {
          const dedupe = process.argv.includes('dedupe');
          const { MOTECH_PLUGIN_DEDUPE } = process.env;

          if (!MOTECH_PLUGIN_DEDUPE && !dedupe) {
            process.env.MOTECH_PLUGIN_DEDUPE = 'true';

            const check = await execute('yarn dedupe --check');

            if (check) {
              await execute('yarn dedupe');
            }
          }
        },
      },
    };
  },
  name: '@motech-development/plugin-dedupe',
};
