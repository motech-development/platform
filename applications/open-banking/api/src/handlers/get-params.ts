import { Handler } from 'aws-lambda';
import { object, string } from 'yup';

const schema = object()
  .shape({
    bank: string().required(),
    callback: string().required(),
    companyId: string().required(),
    id: string().required(),
    token: string().required(),
    url: string().required(),
    user: string().nullable(),
  })
  .required();

export const handler: Handler = async event => {
  const result = await schema.validate(event, {
    stripUnknown: true,
  });

  const { user } = result;

  return {
    ...result,
    check: !!user,
  };
};
