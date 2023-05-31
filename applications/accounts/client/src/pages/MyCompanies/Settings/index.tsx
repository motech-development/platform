import { useQuery } from '@apollo/client';
import { ConditionalRoute } from '@motech-development/auth';
import { lazy } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import GET_BANK_SETTINGS, {
  IGetBankSettingsInput,
  IGetBankSettingsOutput,
} from '../../../graphql/bank/GET_BANK_SETTINGS';
import Connected from '../../../components/Connected';
import invariant from '../../../utils/invariant';

const Bank = lazy(() => import('./Bank'));
const Settings = lazy(() => import('./Settings'));

function SettingsRoutes() {
  const { companyId } = useParams();

  invariant(companyId);

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
        <Routes>
          <Route
            path="bank/*"
            element={
              <ConditionalRoute
                element={<Bank />}
                condition={!data.getBankSettings.account}
                redirect="/not-found"
              />
            }
          />
          <Route index element={<Settings />} />
        </Routes>
      )}
    </Connected>
  );
}

export default SettingsRoutes;
