module.exports = {
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        displayName: true,
        minify: true,
        pure: true,
        ssr: false,
        transpileTemplateLiterals: true,
      },
    ],
  ],
  presets: [['react-app', { flow: false, typescript: true }]],
};
