import { render } from '@testing-library/react';
import IOption from '../../utils/option';
import Select from '../Select';

describe('Select', () => {
  let options: IOption[];

  beforeEach(() => {
    options = [
      {
        name: 'Item 1',
        value: '1',
      },
      {
        name: 'Item 2',
        value: '2',
      },
    ];
  });

  describe('primary', () => {
    it('should correctly render', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          options={options}
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          helpText="This is some help text"
          placeholder="Select item"
          options={options}
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          errorMessage="This is an error"
          placeholder="Select item"
          options={options}
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="none"
          options={options}
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="sm"
          options={options}
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="md"
          options={options}
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="lg"
          options={options}
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('secondary', () => {
    it('should correctly render', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          options={options}
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          helpText="This is some help text"
          placeholder="Select item"
          options={options}
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          errorMessage="This is an error"
          placeholder="Select item"
          options={options}
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="none"
          options={options}
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="sm"
          options={options}
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="md"
          options={options}
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="lg"
          options={options}
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('danger', () => {
    it('should correctly render', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          options={options}
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          helpText="This is some help text"
          placeholder="Select item"
          options={options}
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          errorMessage="This is an error"
          placeholder="Select item"
          options={options}
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="none"
          options={options}
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="sm"
          options={options}
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="md"
          options={options}
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="lg"
          options={options}
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('success', () => {
    it('should correctly render', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          options={options}
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          helpText="This is some help text"
          placeholder="Select item"
          options={options}
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          errorMessage="This is an error"
          placeholder="Select item"
          options={options}
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="none"
          options={options}
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="sm"
          options={options}
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="md"
          options={options}
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="lg"
          options={options}
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('warning', () => {
    it('should correctly render', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          options={options}
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          helpText="This is some help text"
          placeholder="Select item"
          options={options}
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          errorMessage="This is an error"
          placeholder="Select item"
          options={options}
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="none"
          options={options}
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="sm"
          options={options}
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="md"
          options={options}
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <Select
          name="test"
          label="Test select"
          placeholder="Select item"
          spacing="lg"
          options={options}
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
