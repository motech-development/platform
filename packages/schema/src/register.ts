import { object, ref, string } from 'yup';

const schema = object().shape({
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords to not match')
    .required('Please confirm your password'),
  email: string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  // eslint-disable-next-line @typescript-eslint/camelcase
  family_name: string().required('Your surname is required'),
  // eslint-disable-next-line @typescript-eslint/camelcase
  given_name: string().required('Your forename is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase character')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase character')
    .matches(
      /[^a-zA-Z\s]+/,
      'Password must contain at least 1 number or special character (!@#$%^&*)',
    )
    .required('Password is required'),
});

export default schema;
