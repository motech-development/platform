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
// TODO: Save user and bank in pipeline
const Callback: FC = () => {
  const history = useHistory();
  const { companyId } = useParams<ICallbackParams>();
  const query = useQuery();
  const bank = query.get('institution');
  const consent = query.get('consent');
  const user = query.get('user-uuid');
  const [mutation] = useMutation<
    IUpdateBankSettingsOutput,
    IUpdateBankSettingsInput
  >(UPDATE_BANK_SETTINGS, {
    onCompleted: ({ updateBankSettings }) => {
      const { id, user: userResult } = updateBankSettings;

      if (userResult) {
        history.push(`/my-companies/settings/${id}/bank/select-account`);
      } else {
        // TODO: Show error message
      }
    },
  });

  useEffect(() => {
    (async () => {
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
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loader />;
};

export default Callback;
