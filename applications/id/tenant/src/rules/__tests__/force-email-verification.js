describe('force-email-verification', () => {
  describe('when user is verified', () => {
    it.todo('should remove emailVerificationSentDate if it exists');

    it.todo(
      'should not update meta data if emailVerificationSentDate does not exist',
    );

    it.todo('should call the callback with the correct params');
  });

  describe('when user is not verified', () => {
    it.todo('should call the callback with the correct params');

    it.todo(
      'should not resend the verification email if it was already sent today',
    );

    it.todo(
      'should resend the verification email if it has not been sent today',
    );

    it.todo('should update the emailVerificationSentDate to today');
  });
});
