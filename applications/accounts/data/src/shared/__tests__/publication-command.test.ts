import {
  IPublicationCommand,
  serializePublicationCommand,
} from '../publication-command';

describe('publication command', () => {
  it('serializes the outbound Scheduler payload', () => {
    const command: IPublicationCommand = {
      expectedScheduledTime: '2026-07-24T12:00:00.000Z',
      transactionId: 'transaction-id',
    };

    expect(JSON.parse(serializePublicationCommand(command))).toEqual(command);
  });
});
