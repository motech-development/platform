export interface ICompany {
  balance: {
    balance: string;
    vat: {
      owed: string;
      paid: string;
    };
  };
  company: {
    address: {
      line1: string;
      line2: string;
      line3: string;
      line4: string;
      line5: string;
    };
    bank: {
      accountNumber: string;
      sortCode: string;
    };
    companyNumber: string;
    contact: {
      email: string;
      telephone: string;
    };
    name: string;
  };
  vat: {
    charge: string;
    pay: string;
    registration: string;
    scheme: string;
  };
  yearEnd: {
    day: string;
    month: string;
  };
}

export type TCompanies = ICompany[];
