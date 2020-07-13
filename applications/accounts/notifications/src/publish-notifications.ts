// import aws4 from 'aws4';
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

    // TODO: Generate header from aws4
    // const host = ENDPOINT.replace('https://', '');
    // const path = `/${STAGE}/api/v1/users/${user}`;
    // const url = ENDPOINT + path;

    // const opts = {
    //   host,
    //   method: 'DELETE',
    //   path,
    //   url,
    // };

    // const request = aws4.sign(opts);

    // delete request.headers.Host;
    // delete request.headers['Content-Length'];

    // TODO: URL env var
    return axios({
      data: JSON.stringify(mutation),
      method: 'POST',
      url: '',
    });
  });

  await Promise.all([mutations]);
};
