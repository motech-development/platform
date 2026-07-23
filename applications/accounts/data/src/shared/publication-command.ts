export interface IPublicationCommand {
  expectedScheduledTime: string;
  transactionId: string;
}

export const parsePublicationCommand = (body: string): IPublicationCommand => {
  const command = JSON.parse(body) as Partial<IPublicationCommand>;

  if (
    typeof command.expectedScheduledTime !== 'string' ||
    typeof command.transactionId !== 'string' ||
    !command.expectedScheduledTime ||
    !command.transactionId
  ) {
    throw new Error('Invalid publication command');
  }

  return command as IPublicationCommand;
};

export const serializePublicationCommand = (
  command: IPublicationCommand,
): string => JSON.stringify(command);
