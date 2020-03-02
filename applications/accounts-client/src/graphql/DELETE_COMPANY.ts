import { gql, MutationUpdaterFn } from 'apollo-boost';
import GET_COMPANIES, { IGetCompaniesOutput } from './GET_COMPANIES';

export interface IDeleteCompanyInput {
  id: string;
}

export interface IDeleteCompanyOutput {
  deleteCompany: {
    id: string;
  };
}

export const updateCache: MutationUpdaterFn<IDeleteCompanyOutput> = (
  client,
  { data },
) => {
  const cache = client.readQuery<IGetCompaniesOutput>({
    query: GET_COMPANIES,
  });

  if (cache) {
    cache.getCompanies.items = cache.getCompanies.items.filter(
      ({ id }) => data!.deleteCompany.id !== id,
    );

    client.writeQuery<IGetCompaniesOutput>({
      data: cache,
      query: GET_COMPANIES,
    });
  }
};

const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
    }
  }
`;

export default DELETE_COMPANY;
