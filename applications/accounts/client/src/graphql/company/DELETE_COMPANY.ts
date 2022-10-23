import { gql, MutationUpdaterFn, Reference } from '@apollo/client';

export interface IDeleteCompanyInput {
  id: string;
}

export interface IDeleteCompanyOutput {
  deleteCompany?: {
    id: string;
    name: string;
    owner: string;
  };
}

export const updateCache: MutationUpdaterFn<IDeleteCompanyOutput> = (
  cache,
  { data },
) => {
  if (data?.deleteCompany) {
    const { deleteCompany } = data;

    cache.modify({
      fields: {
        items: (refs: Reference[], { readField }) =>
          refs.filter((ref) => readField('id', ref) !== deleteCompany.id),
      },
      id: cache.identify({
        __typename: 'Companies',
        id: deleteCompany.owner,
      }),
    });
  }
};

const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
      name
      owner
    }
  }
`;

export default DELETE_COMPANY;
