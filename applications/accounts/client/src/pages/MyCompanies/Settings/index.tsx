import { useQuery } from '@apollo/client';
import { ConditionalRoute, ProtectedRoute } from '@motech-development/auth';
import { FC, lazy, memo } from 'react';
import { Switch, useParams } from 'react-router-dom';
import GET_BANK_SETTINGS, {
  IGetBankSettingsInput,
  IGetBankSettingsOutput,
} from '../../../graphql/bank/GET_BANK_SETTINGS';
import Connected from '../../../components/Connected';

const Bank = lazy(() => import('./Bank'));
const Settings = lazy(() => import('./Settings'));

interface IRouteParams {
  companyId: string;
}

const Routes: FC = () => {
  const { companyId } = useParams<IRouteParams>();
  const { data, error, loading } = useQuery<
    IGetBankSettingsOutput,
    IGetBankSettingsInput
  >(GET_BANK_SETTINGS, {
    variables: {
      id: companyId,
    },
  });

  return (
    <Connected error={error} loading={loading}>
      {data?.getBankSettings && (
        <Switch>
          <ConditionalRoute
            component={Bank}
            path="/my-companies/settings/:companyId/bank"
            condition={!data.getBankSettings.account}
            redirect="/not-found"
          />
          <ProtectedRoute
            exact
            component={Settings}
            path="/my-companies/settings/:companyId"
          />
        </Switch>
      )}
    </Connected>
  );
};

export default memo(Routes);
