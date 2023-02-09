export interface ISetting {
  categories: {
    name: string;
    vatRate: string;
  }[];
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

export type TSettings = ISetting[];
