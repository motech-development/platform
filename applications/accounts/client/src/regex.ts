const regex = {
  address: {
    postcode:
      /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)$/,
  },
  bank: {
    accountNumber: /^(\d){8}$/,
    sortCode: /^(\d){2}-(\d){2}-(\d){2}$/,
  },
  companyNumber: /^[0-9]{8}$/,
  contact: {
    telephone:
      /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|#)\d+)?)$/,
  },
  vatRegistration: /^([GB])*(([1-9]\d{8})|([1-9]\d{11}))$/,
};

export default regex;
