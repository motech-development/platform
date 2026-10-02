/** Tailwind 4.3.2 logical utilities for each physical utility family. */
const logicalReplacements = {
  'border-b': 'border-be',
  'border-l': 'border-s',
  'border-r': 'border-e',
  'border-t': 'border-bs',
  bottom: 'inset-be',
  'clear-left': 'clear-start',
  'clear-right': 'clear-end',
  'float-left': 'float-start',
  'float-right': 'float-end',
  h: 'block',
  left: 'start',
  'max-h': 'max-block',
  'max-w': 'max-inline',
  mb: 'mbe',
  'min-h': 'min-block',
  'min-w': 'min-inline',
  ml: 'ms',
  mr: 'me',
  mt: 'mbs',
  pb: 'pbe',
  pl: 'ps',
  pr: 'pe',
  pt: 'pbs',
  right: 'end',
  'rounded-b': 'rounded-es and rounded-ee',
  'rounded-bl': 'rounded-es',
  'rounded-br': 'rounded-ee',
  'rounded-l': 'rounded-s',
  'rounded-r': 'rounded-e',
  'rounded-t': 'rounded-ss and rounded-se',
  'rounded-tl': 'rounded-ss',
  'rounded-tr': 'rounded-se',
  'scroll-mb': 'scroll-mbe',
  'scroll-ml': 'scroll-ms',
  'scroll-mr': 'scroll-me',
  'scroll-mt': 'scroll-mbs',
  'scroll-pb': 'scroll-pbe',
  'scroll-pl': 'scroll-ps',
  'scroll-pr': 'scroll-pe',
  'scroll-pt': 'scroll-pbs',
  size: 'inline and block',
  'text-left': 'text-start',
  'text-right': 'text-end',
  top: 'inset-bs',
  w: 'inline',
};
const valueRequiredFamilies = new Set([
  'clear-left',
  'clear-right',
  'float-left',
  'float-right',
  'text-left',
  'text-right',
]);
const physicalArbitraryProperty =
  /\[(?:(?:min-|max-)?(?:width|height)|(?:margin|padding|border)-(?:left|right|top|bottom)(?:-\w+)?|left|right|top|bottom|border-(?:top|bottom)-(?:left|right)-radius):/;

function splitOutsideBrackets(text, separator) {
  const parts = [];
  let depth = 0;
  let part = '';

  Array.from(text).forEach((character) => {
    if (character === '[' || character === '(') {
      depth += 1;
    } else if ((character === ']' || character === ')') && depth > 0) {
      depth -= 1;
    }

    if (depth === 0 && separator.test(character)) {
      parts.push(part);
      part = '';
    } else {
      part += character;
    }
  });
  parts.push(part);

  return parts;
}

function physicalFamily(token) {
  const utility = splitOutsideBrackets(token, /:/)
    .at(-1)
    .replace(/^!|!$/g, '')
    .replace(/^-/, '');

  return Object.keys(logicalReplacements).find((family) =>
    valueRequiredFamilies.has(family)
      ? utility === family
      : utility === family || utility.startsWith(`${family}-`),
  );
}

/** Reject physical utility families in every string that carries Breeze classes. */
const logicalProperties = {
  create(context) {
    function check(node, value) {
      splitOutsideBrackets(value, /\s/)
        .filter((token) => token.startsWith('breeze:'))
        .forEach((token) => {
          const family = physicalFamily(token);

          if (family) {
            context.report({
              data: {
                replacement: logicalReplacements[family],
                token,
              },
              messageId: 'physical',
              node,
            });
          } else if (physicalArbitraryProperty.test(token)) {
            context.report({
              data: {
                token,
              },
              messageId: 'physicalArbitrary',
              node,
            });
          }
        });
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          check(node, node.value);
        }
      },
      TemplateElement(node) {
        check(node, node.value.cooked ?? node.value.raw);
      },
    };
  },
  meta: {
    docs: {
      description: 'Use logical properties in Breeze utility classes.',
    },
    messages: {
      physical:
        'Use a logical utility instead of "{{token}}": Tailwind provides {{replacement}}.',
      physicalArbitrary:
        'Use a logical CSS property instead of the physical property in "{{token}}" (for example inline-size, margin-inline-start or inset-block-start).',
    },
    schema: [],
    type: 'problem',
  },
};

export default logicalProperties;
