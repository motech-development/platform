import qs from 'qs';

const useQs = () => {
  const parse = <T>(value: string) =>
    qs.parse(value, {
      decoder: (str) => {
        if (/^(\d+|\d*\.\d+)$/.test(str)) {
          return parseFloat(str);
        }

        const keywords = {
          false: false,
          null: null,
          true: true,
        };

        if (str in keywords) {
          return keywords[str];
        }

        return decodeURIComponent(str);
      },
    }) as unknown as T;

  const stringify = <T>(value: T) => qs.stringify(value);

  return {
    parse,
    stringify,
  };
};

export default useQs;
