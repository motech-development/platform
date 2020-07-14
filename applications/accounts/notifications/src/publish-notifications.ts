import aws4 from 'aws4';
import { DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import axios from 'axios';

const NotificationBeaconMutation = `
  mutation NotificationBeacon($id: ID!) {
    notificationBeacon(id: $id) {
      id
    }
  }
`;

const configureMutation = (id: string) => ({
  operationName: 'NotificationBeacon',
  query: NotificationBeaconMutation,
  variables: {
    input: {
      id,
    },
  },
});

export const handler: DynamoDBStreamHandler = async event => {
  const { ENDPOINT } = process.env;

  if (!ENDPOINT) {
    throw new Error('No endpoint set');
  }

  const { Records } = event;
  const mutations = Records.filter(
    ({ dynamodb, eventName }) =>
      eventName === 'INSERT' && dynamodb && dynamodb.NewImage,
  ).map(({ dynamodb }) => {
    const { NewImage } = dynamodb as StreamRecord;
    const { id } = DynamoDB.Converter.unmarshall(
      NewImage as DynamoDB.AttributeMap,
    );
    const mutation = configureMutation(id);
    const url = ENDPOINT.replace('https://', '').split('/');
    const [host, path] = url;
    const opts = {
      data: JSON.stringify(mutation),
      host,
      method: 'POST',
      path,
      url,
    };

    const request = aws4.sign(opts);

    delete request.headers.Host;
    delete request.headers['Content-Length'];

    return axios(request);
  });

  await Promise.all(mutations);
};
