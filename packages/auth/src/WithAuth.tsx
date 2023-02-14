import { useQueryString } from '@motech-development/query-string-hook';
import { ReactNode, useEffect } from 'react';
import { useAuth } from './AuthProvider';

export interface IWithAuthProps {
  children: ReactNode;
  fallback: ReactNode;
  onError(message: string): void;
}

function WithAuth({ children, fallback, onError }: IWithAuthProps) {
  const query = useQueryString();
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const error = query.get('error');
      const message = query.get('error_description');

      if (error && message) {
        onError(message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default WithAuth;
