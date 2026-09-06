interface ITransactionCompany {
  companyId?: unknown;
  data?: unknown;
  date?: unknown;
  owner?: unknown;
  status?: unknown;
}

const transactionCompanyId = ({
  companyId,
  data,
  date,
  owner,
  status,
}: ITransactionCompany): string | undefined => {
  // Existing updates can change indexed membership without updating companyId.
  if (
    typeof data === 'string' &&
    typeof owner === 'string' &&
    typeof status === 'string' &&
    typeof date === 'string'
  ) {
    const prefix = `${owner}:`;
    const suffix = `:${status}:${date}`;
    if (data.startsWith(prefix) && data.endsWith(suffix)) {
      return data.slice(prefix.length, -suffix.length) || undefined;
    }
  }

  return typeof companyId === 'string' ? companyId : undefined;
};

export default transactionCompanyId;
