import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextBox from '../TextBox';

describe('TextBox', () => {
  describe('primary', () => {
    it('should correctly render', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="primary" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          helpText="This is some help text"
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when decimal scale is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="primary"
          decimalScale={2}
        />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          errorMessage="This is an error"
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when format is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox
          name="test"
          label="Test input"
          format="##-##-##"
          theme="primary"
        />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '000000');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when prefix is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox name="test" label="Test input" theme="primary" prefix="£" />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="primary"
          spacing="none"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="primary" spacing="sm" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="primary" spacing="md" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="primary" spacing="lg" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when suffix is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox name="test" label="Test input" theme="primary" suffix="%" />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when type is set', () => {
      const { container } = render(
        <TextBox name="test" type="email" label="Test input" theme="primary" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('secondary', () => {
    it('should correctly render', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="secondary" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          helpText="This is some help text"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when decimal scale is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="secondary"
          decimalScale={2}
        />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          errorMessage="This is an error"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when format is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox
          name="test"
          label="Test input"
          format="##-##-##"
          theme="secondary"
        />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '000000');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when prefix is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox name="test" label="Test input" theme="secondary" prefix="£" />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="secondary"
          spacing="none"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="secondary"
          spacing="sm"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="secondary"
          spacing="md"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="secondary"
          spacing="lg"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when suffix is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox name="test" label="Test input" theme="secondary" suffix="%" />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when type is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          type="email"
          label="Test input"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('danger', () => {
    it('should correctly render', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="danger" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          helpText="This is some help text"
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when decimal scale is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="danger"
          decimalScale={2}
        />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          errorMessage="This is an error"
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when format is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox
          name="test"
          label="Test input"
          format="##-##-##"
          theme="danger"
        />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '000000');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when prefix is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox name="test" label="Test input" theme="danger" prefix="£" />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="danger"
          spacing="none"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="danger" spacing="sm" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="danger" spacing="md" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="danger" spacing="lg" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when suffix is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox name="test" label="Test input" theme="danger" suffix="%" />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when type is set', () => {
      const { container } = render(
        <TextBox name="test" type="email" label="Test input" theme="danger" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('success', () => {
    it('should correctly render', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="success" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          helpText="This is some help text"
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when decimal scale is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="success"
          decimalScale={2}
        />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          errorMessage="This is an error"
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when format is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox
          name="test"
          label="Test input"
          format="##-##-##"
          theme="success"
        />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '000000');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when prefix is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox name="test" label="Test input" theme="success" prefix="£" />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="success"
          spacing="none"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="success" spacing="sm" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="success" spacing="md" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="success" spacing="lg" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when suffix is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox name="test" label="Test input" theme="success" suffix="%" />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when type is set', () => {
      const { container } = render(
        <TextBox name="test" type="email" label="Test input" theme="success" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('warning', () => {
    it('should correctly render', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="warning" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          helpText="This is some help text"
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when decimal scale is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="warning"
          decimalScale={2}
        />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          errorMessage="This is an error"
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when format is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox
          name="test"
          label="Test input"
          format="##-##-##"
          theme="warning"
        />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '000000');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when prefix is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox name="test" label="Test input" theme="warning" prefix="£" />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <TextBox
          name="test"
          label="Test input"
          theme="warning"
          spacing="none"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="warning" spacing="sm" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="warning" spacing="md" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <TextBox name="test" label="Test input" theme="warning" spacing="lg" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when suffix is set', async () => {
      const { container, findByLabelText } = render(
        <TextBox name="test" label="Test input" theme="warning" suffix="%" />,
      );

      const input = await findByLabelText('Test input');

      userEvent.type(input, '20');

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when type is set', () => {
      const { container } = render(
        <TextBox name="test" type="email" label="Test input" theme="warning" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
