import qs from 'qs';

export interface IUseQs<T> {
  parse: (value: string) => T;
  stringify: (value: T) => string;
}

type TProtectedKeywords = 'false' | 'null' | 'true';

const useQs = <T>(): IUseQs<T> => {
  const parse = (value: string) =>
    qs.parse(value, {
      decoder: (str) => {
        if (/^(\d+|\d*\.\d+)$/.test(str)) {
          return parseFloat(str);
        }

        const keywords = {
          false: false,
          null: null,
          true: true,
        } as const;

        if (str in keywords) {
          return keywords[str as TProtectedKeywords];
        }

        return decodeURIComponent(str);
      },
    }) as unknown as T;

  const stringify = (value: T) => qs.stringify(value);

  return {
    parse,
    stringify,
  };
};

export default useQs;
