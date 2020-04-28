import getBalance, { IEvent } from '../get-balance';

describe('get-balance', () => {
  let event: IEvent;

  beforeEach(() => {
    event = {
      id: 'id',
      owner: 'owner',
    };
  });

  it('should throw an error if no table is set', async () => {
    await expect(getBalance(event)).rejects.toThrow('No table set');
  });
});
