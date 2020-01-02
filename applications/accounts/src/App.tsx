import React, { FC, memo } from 'react';
import { useAuth0 } from './contexts/auth0';

const App: FC = () => {
  const { isLoading, loginWithRedirect, logout, user } = useAuth0();
  const logOut = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <>
      {!isLoading && (
        <>
          {user ? (
            <>
              <p>Hello {user.name}</p>

              <button type="button" onClick={logOut}>
                Log out
              </button>
            </>
          ) : (
            <button type="button" onClick={loginWithRedirect}>
              Log in
            </button>
          )}
        </>
      )}
    </>
  );
};

export default memo(App);
