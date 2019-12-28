import { object, string } from 'yup';

const schema = object().shape({
  password: string().required('Password is required'),
  username: string().required('Email address is required'),
});

export default schema;
