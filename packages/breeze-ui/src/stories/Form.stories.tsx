import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Card from '../components/Card';
import CheckBox from '../components/CheckBox';
import Col from '../components/Col';
import DatePicker from '../components/DatePicker';
import FileUpload from '../components/FileUpload';
import Row from '../components/Row';
import TextBox from '../components/TextBox';
import Typeahead from '../components/Typeahead';
import Radio from '../components/Radio';
import Select from '../components/Select';

const stories = storiesOf('Form', module);
const options = [
  {
    name: 'Travel',
    value: 'travel',
  },
  {
    name: 'Sales',
    value: 'sales',
  },
];
const disabled = () => boolean('Disabled', false);
const readOnly = () => boolean('Read only', false);

stories.addDecorator(withKnobs);

stories.add('Basic form', () => (
  <>
    <Row>
      <Col md={6} mdOffset={4}>
        <Card padding="lg">
          <form>
            <TextBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="name"
              type="text"
              label="Name"
              placeholder="Name"
            />

            <TextBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="email"
              type="email"
              label="Email address"
              placeholder="example@motechdevelopment.co.uk"
              helpText="Your email address"
            />

            <TextBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="password"
              type="password"
              label="Password"
              spacing="lg"
            />

            <Select
              disabled={disabled()}
              options={options}
              name="category"
              label="Category"
              placeholder="Select category"
            />

            <Radio
              disabled={disabled()}
              readOnly={readOnly()}
              options={options}
              name="choice"
              label="Choice"
            />

            <CheckBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="terms"
              label="I agree"
              legend="Do you agree to the Ts &amp; Cs?"
            />

            <TextBox
              disabled={disabled()}
              errorMessage="This field is required"
              readOnly={readOnly()}
              name="extra.telephone"
              type="text"
              label="Telephone"
              prefix="+44"
            />

            <TextBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="extra.vat"
              type="text"
              label="VAT"
              suffix="%"
            />

            <TextBox
              disabled={disabled()}
              decimalScale={2}
              readOnly={readOnly()}
              name="extra.price"
              type="text"
              label="Price"
              prefix="£"
            />

            <TextBox
              disabled={disabled()}
              readOnly={readOnly()}
              name="extra.sortCode"
              type="text"
              label="Sort code"
              format="##-##-##"
            />

            <Typeahead
              disabled={disabled()}
              readOnly={readOnly()}
              name="typeahead"
              label="Typeahead"
              placeholder="Begin typing something..."
              suggestions={[
                {
                  name: 'ABC',
                  value: 'ABC',
                },
                {
                  name: 'DEF',
                  value: 'DEF',
                },
                {
                  name: '123 (sets XYZ)',
                  value: 'XYZ',
                },
              ]}
            />

            <DatePicker
              disabled={disabled()}
              readOnly={readOnly()}
              name="dob"
              label="Date of birth"
            />

            <FileUpload
              accept="image/png"
              buttonText="Browse"
              disabled={disabled()}
              helpText="Select a photo to upload"
              name="upload"
              label="Your photo"
              onSelect={(file, form) => {
                form.setFieldValue('upload', file.name);
              }}
            />
          </form>
        </Card>
      </Col>
    </Row>
  </>
));
