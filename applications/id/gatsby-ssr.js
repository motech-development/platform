/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-filename-extension */
const React = require('react');

exports.onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  setHeadComponents([
    <link
      href="https://fonts.googleapis.com/css?family=Cabin:400,600&display=swap"
      rel="stylesheet"
    />,
  ]);

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
