# Publish compiled Breeze styles

Breeze UI uses Tailwind internally and publishes two compiled stylesheet entry points: required `styles.css` and optional `reset.css`, which normalizes content only within `[data-breeze-root]` without Tailwind Preflight or a global document baseline. The former `theme.css` entry point is dropped. Consumers do not scan Breeze sources or align Tailwind versions. Token selection and `color-scheme` live on the document element; ordinary component painting and reset rules stay scoped to the provider root.

The public styling API is closed: components expose typed visual variants and intentional native attributes and refs, without `className`, `style`, slot props, render props, or generic styling passthrough. Application-owned wrappers handle placement so consumers cannot override component styling or interaction structure.

The closed document-global exception consists of view-transition name grants and recipes, plus reduced-motion rules for the view-transition pseudo-elements. Those pseudo-elements sit outside `[data-breeze-root]` and cannot be reached by scoped selectors. The scoped reduced-motion rules in `base.css` remain necessary for ordinary elements within Breeze. Future styles are scoped by default; a document-global exception must name why a scoped selector cannot reach its target.
