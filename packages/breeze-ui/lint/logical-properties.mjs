const physicalUtility =
  /(?:^|:)(?:!)?-?(?:(?:[mp][lrtb]|left|right|top|bottom|w|h|size|min-w|max-w|min-h|max-h|border-[lrtb]|rounded-(?:tl|tr|bl|br|l|r|t|b))-(?:.+)|(?:text|float|clear)-(?:left|right))(?:!)?$/;
const physicalArbitraryProperty =
  /\[(?:(?:min-|max-)?(?:width|height)|(?:margin|padding|border)-(?:left|right|top|bottom)(?:-\w+)?|left|right|top|bottom|border-(?:top|bottom)-(?:left|right)-radius):/;

/** Reject physical utility families in literal recipes and JSX class strings. */
const logicalProperties = {
  create(context) {
    function check(node, value) {
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
