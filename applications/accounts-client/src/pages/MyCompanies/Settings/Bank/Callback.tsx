import { useMutation } from '@apollo/react-hooks';
import { Loader } from '@motech-development/breeze-ui';
import React, { FC, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import UPDATE_BANK_SETTINGS, {
  IUpdateBankSettingsInput,
  IUpdateBankSettingsOutput,
} from '../../../../graphql/bank/UPDATE_BANK_SETTINGS';
import useQuery from '../../../../hooks/useQuery';

interface ICallbackParams {
  companyId: string;
}

// TODO: Error handling
const Callback: FC = () => {
  const history = useHistory();
  const { companyId } = useParams<ICallbackParams>();
  const query = useQuery();
  const [mutation] = useMutation<
    IUpdateBankSettingsOutput,
    IUpdateBankSettingsInput
  >(UPDATE_BANK_SETTINGS, {
    onCompleted: ({ updateBankSettings }) => {
      const { id } = updateBankSettings;

      history.push(`/my-companies/settings/${id}/bank/select-account`);
    },
  });
  const bank = query.get('institution');
  const consent = query.get('consent');
  const user = query.get('user-uuid');

  useEffect(() => {
    (async () => {
      if (bank && consent && user) {
        await mutation({
          variables: {
            input: {
              bank,
              consent,
              id: companyId,
              user,
            },
          },
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loader />;
};

export default Callback;
