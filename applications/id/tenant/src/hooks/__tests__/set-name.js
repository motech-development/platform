const hook = require('../set-name');

describe('set-name', () => {
  let callback;
  let context;
  let user;

  beforeEach(() => {
    callback = jest.fn();
    context = {};
  });

  it('should set name if meta data is set', () => {
    user = {
      user_metadata: {
        family_name: 'User',
        given_name: 'Test',
        other: 'Hello',
      },
    };

    hook(user, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      user: {
        family_name: 'User',
        given_name: 'Test',
        name: 'Test User',
        user_metadata: {
          other: 'Hello',
        },
      },
    });
  });

  it('should not do anything if the metadata is not set', () => {
    user = {
      email: 'test@example.com',
    };

    hook(user, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      user: {
        email: 'test@example.com',
      },
    });
  });

  it('should not do anything if user has metadata without any name fields', () => {
    user = {
      email: 'test@example.com',
      user_metadata: {
        other: 'Hello',
      },
    };

    hook(user, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      user: {
        email: 'test@example.com',
        user_metadata: {
          other: 'Hello',
        },
      },
    });
  });
});
