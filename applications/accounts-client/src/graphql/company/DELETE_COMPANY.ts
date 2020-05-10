import { gql, MutationUpdaterFn } from 'apollo-boost';
import GET_COMPANIES, { IGetCompaniesOutput } from './GET_COMPANIES';

export interface IDeleteCompanyInput {
  id: string;
}

export interface IDeleteCompanyOutput {
  deleteCompany: {
    id: string;
    name: string;
  };
}

export const updateCache: MutationUpdaterFn<IDeleteCompanyOutput> = (
  client,
  { data },
) => {
  if (data) {
    const { deleteCompany } = data;

    try {
      const cache = client.readQuery<IGetCompaniesOutput>({
        query: GET_COMPANIES,
      });

      if (cache) {
        cache.getCompanies.items = cache.getCompanies.items.filter(
          ({ id }) => deleteCompany.id !== id,
        );

        client.writeQuery<IGetCompaniesOutput>({
          data: cache,
          query: GET_COMPANIES,
        });
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
};

const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
      name
    }
  }
`;

export default DELETE_COMPANY;
