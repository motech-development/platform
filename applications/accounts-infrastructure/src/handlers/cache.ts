import { CloudFrontResponseHandler } from 'aws-lambda';

export const handler: CloudFrontResponseHandler = (event, _, callback) => {
  const { request, response } = event.Records[0].cf;
  const { headers, status } = response;

  if (status === '200') {
    switch (true) {
      case request.uri.indexOf('index.html') !== -1:
      case request.uri.indexOf('locales') !== -1:
        headers['Cache-Control'] = [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ];
        break;
      default:
        headers['Cache-Control'] = [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ];
    }
  }

  callback(null, response);
};
