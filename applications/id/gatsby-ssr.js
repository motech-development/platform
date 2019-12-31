/* eslint-disable react/no-danger, react/jsx-filename-extension */
const React = require('react');

exports.onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    <script
      dangerouslySetInnerHTML={{
        __html: `
        const auth0Config = JSON.parse(
          decodeURIComponent(escape(window.atob('@@config@@')))
        );
        `,
      }}
    />,
  ]);
};
