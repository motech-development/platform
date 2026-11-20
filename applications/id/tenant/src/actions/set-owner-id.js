exports.onExecutePostLogin = async (event, api) => {
  api.accessToken.setCustomClaim(
    'https://motechdevelopment.co.uk/owner_id',
    event.user.user_id,
  );
};
