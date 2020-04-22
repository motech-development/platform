import { FormikErrors, FormikTouched, getIn } from 'formik';
import { useEffect, useState } from 'react';

const useInputValidation = <T>(
  name: string,
  errors: FormikErrors<T>,
  touched: FormikTouched<T>,
) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const touch = getIn(touched, name);
    const err = getIn(errors, name);

    setError(!!touch && !!err);
  }, [errors, name, touched]);

  return error;
};

export default useInputValidation;
