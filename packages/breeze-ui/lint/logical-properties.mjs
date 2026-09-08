const physicalUtility =
  /(?:^|:)(?:!)?-?(?:(?:[mp][lrtb]|left|right|top|bottom|w|h|size|min-w|max-w|min-h|max-h|border-[lrtb]|rounded-(?:tl|tr|bl|br|l|r|t|b))-(?:.+)|(?:text|float|clear)-(?:left|right))(?:!)?$/;
const physicalArbitraryProperty =
  /\[(?:(?:min-|max-)?(?:width|height)|(?:margin|padding|border)-(?:left|right|top|bottom)(?:-\w+)?|left|right|top|bottom|border-(?:top|bottom)-(?:left|right)-radius):/;

/** Reject physical utility families in literal recipes and JSX class strings. */
const logicalProperties = {
  create(context) {
    function isClassValue(node) {
      let current = node;

      while (current.parent) {
        const { parent } = current;

        if (parent.type === 'Property' && parent.key === current) {
          return false;
        }

        if (parent.type === 'JSXAttribute') {
          return parent.name.name === 'className';
        }

        if (parent.type === 'VariableDeclarator') {
          return (
            parent.id.type === 'Identifier' &&
            ['variants', 'className'].includes(parent.id.name)
          );
        }

        current = parent;
      }

      return false;
    }

    function check(node, value) {
      if (!isClassValue(node)) {
        return;
      }

      const invalid = value
        .split(/\s+/)
        .filter(
          (token) =>
            physicalUtility.test(token) ||
            physicalArbitraryProperty.test(token),
        );

      invalid.forEach((token) => {
        context.report({
          data: {
            token,
          },
          messageId: 'physical',
          node,
        });
      });
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          check(node, node.value);
        }
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
    };
  },
  meta: {
    docs: {
      description: 'Use logical properties in Breeze utility classes.',
    },
    messages: {
      physical:
        'Use a logical utility instead of "{{token}}" (for example ms/me, ps/pe, start/end, min-block/min-inline).',
    },
    schema: [],
    type: 'problem',
  },
};

export default logicalProperties;
