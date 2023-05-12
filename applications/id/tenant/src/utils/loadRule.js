/* eslint-disable no-underscore-dangle, import/no-dynamic-require */
const { createInstrumenter } = require('istanbul-lib-instrument');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { createContext, runInNewContext } = require('node:vm');

const instrumenter = createInstrumenter({
  additionalProperties: true,
  properties: {
    autoWrap: {
      type: 'boolean',
    },
    compact: {
      type: 'boolean',
    },
    coverageVariable: {
      type: 'string',
    },
    debug: {
      type: 'boolean',
    },
    esModules: {
      type: 'boolean',
    },
    preserveComments: {
      type: 'boolean',
    },
    produceSourceMap: {
      type: 'boolean',
    },
  },
  type: 'object',
});

const instrumentAsync = (content, location) =>
  new Promise((res, rej) => {
    const execute = `(() => ${content})();`;
    const fullPath = resolve(location);

    instrumenter.instrument(execute, fullPath, (err, instrumentedSource) => {
      if (err) {
        rej(new Error(err));
      } else {
        res(instrumentedSource);
      }
    });
  });

const requireWithVersionSupport = (moduleName) => {
  const name = moduleName.split('@')[0];

  return require(name);
};

// istanbul ignore next
// eslint-disable-next-line no-undef
const coverage = global.__coverage__ ? __coverage__ : {};

const loadRule = async (location, auth0) => {
  const content = readFileSync(location);
  const instrumentedSource = await instrumentAsync(
    content.toString(),
    location,
  );

  const context = createContext({
    UnauthorizedError: Error,
    __coverage__: coverage,
    auth0,
    console,
    require: requireWithVersionSupport,
  });

  return runInNewContext(instrumentedSource, context, location);
};

module.exports = loadRule;
