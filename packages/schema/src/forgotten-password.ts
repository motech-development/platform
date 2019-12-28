import { object, string } from 'yup';

const schema = object().shape({
  email: string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
});

export default schema;
