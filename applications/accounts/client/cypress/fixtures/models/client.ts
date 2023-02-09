export interface IClient {
  address: {
    line1: string;
    line2: string;
    line3: string;
    line4: string;
    line5: string;
  };
  contact: {
    email: string;
    telephone: string;
  };
  name: string;
}

export type TClients = IClient[];
