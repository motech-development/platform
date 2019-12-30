/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-filename-extension */
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
