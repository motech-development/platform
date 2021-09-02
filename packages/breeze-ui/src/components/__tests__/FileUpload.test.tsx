import { render } from '@testing-library/react';
import FileUpload from '../FileUpload';

describe('FileUpload', () => {
  describe('primary', () => {
    it('should correctly render', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          helpText="This is some help text"
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          errorMessage="This is an error"
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when loading', () => {
      const { container } = render(
        <FileUpload
          loading
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="none"
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="sm"
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="md"
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="lg"
          theme="primary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('secondary', () => {
    it('should correctly render', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          helpText="This is some help text"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          errorMessage="This is an error"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when loading', () => {
      const { container } = render(
        <FileUpload
          loading
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="none"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="sm"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="md"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="lg"
          theme="secondary"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('danger', () => {
    it('should correctly render', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          helpText="This is some help text"
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          errorMessage="This is an error"
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when loading', () => {
      const { container } = render(
        <FileUpload
          loading
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="none"
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="sm"
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="md"
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="lg"
          theme="danger"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('success', () => {
    it('should correctly render', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          helpText="This is some help text"
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          errorMessage="This is an error"
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when loading', () => {
      const { container } = render(
        <FileUpload
          loading
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="none"
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="sm"
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="md"
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="lg"
          theme="success"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('warning', () => {
    it('should correctly render', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when help text is set', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          helpText="This is some help text"
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when error message is set', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          errorMessage="This is an error"
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when loading', () => {
      const { container } = render(
        <FileUpload
          loading
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to none', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="none"
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to sm', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="sm"
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to md', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="md"
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should correctly render when spacing is set to lg', () => {
      const { container } = render(
        <FileUpload
          buttonText="Browse"
          label="Upload"
          placeholder="Select a file to upload"
          name="upload"
          spacing="lg"
          theme="warning"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
