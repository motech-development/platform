# Use Storybook publication as the UI health check

Pull requests require the `Storybook Publish` status because it reliably proves that Storybook can be built and published. Chromatic's native UI Tests and UI Review statuses remain optional because usage limits can prevent UI Tests from reporting and UI Review is not consistently emitted; neither status nor manual visual review may block merging. This trades enforced visual-difference approval for a dependable Storybook health signal while leaving provider and human review available when useful.
