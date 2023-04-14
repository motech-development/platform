import { mockViewport } from 'jsdom-testing-mocks';
import { act } from '@testing-library/react';
import { Input, Textarea, Upload } from '../Form';
import { setup, sizing, themes } from '../../utilities/jest';

const types = ['text', 'email', 'password', 'tel'] as const;

describe('Form', () => {
  beforeAll(() => {
    mockViewport({
      height: '768px',
      width: '1024px',
    });
  });

  describe('Input', () => {
    it.each(types)(
      'should render the correct output when type is "%s"',
      (type) => {
        const { asFragment } = setup(
          <Input label="Test input" name="testInput" type={type} />,
        );

        expect(asFragment()).toMatchSnapshot();
      },
    );

    it('should render the correct output when field is required', () => {
      const { asFragment } = setup(
        <Input required label="Test input" name="testInput" />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when decimal scale is set', async () => {
      const { asFragment, getByLabelText, user } = setup(
        <Input label="Test input" name="testInput" decimalScale={2} />,
      );

      await act(async () => {
        const input = getByLabelText('Test input');

        await user.type(input, '100');
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when format is set', async () => {
      const { asFragment, getByLabelText, user } = setup(
        <Input label="Test input" name="testInput" format="##-##-##" />,
      );

      await act(async () => {
        const input = getByLabelText('Test input');

        await user.type(input, '123456');
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when prefix is set', async () => {
      const { asFragment, getByLabelText, user } = setup(
        <Input label="Test input" name="testInput" prefix="£" />,
      );

      await act(async () => {
        const input = getByLabelText('Test input');

        await user.type(input, '100');
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when suffix is set', async () => {
      const { asFragment, getByLabelText, user } = setup(
        <Input label="Test input" name="testInput" suffix="px" />,
      );

      await act(async () => {
        const input = getByLabelText('Test input');

        await user.type(input, '100');
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when error message is set', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Input
          label="Test input"
          name="testInput"
          errorMessage="This is an error"
        />,
      );

      await act(async () => {
        const parent = getByTestId('tooltip-parent-element');

        await user.hover(parent);
      });

      expect(asFragment()).toMatchSnapshot();
    });

    describe.each(themes)('when theme is "$theme"', ({ theme }) => {
      it('should render the correct output', () => {
        const { asFragment } = setup(
          <Input label="Test input" name="testInput" theme={theme} />,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when help text is set', () => {
        const { asFragment } = setup(
          <Input
            label="Test input"
            name="testInput"
            helpText="This is a unit test"
            theme={theme}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it.each(sizing)(
        'should render the correct output when spacing is "$size"',
        ({ size }) => {
          const { asFragment } = setup(
            <Input
              label="Test input"
              name="testInput"
              spacing={size}
              theme={theme}
            />,
          );

          expect(asFragment()).toMatchSnapshot();
        },
      );
    });
  });

  describe('Textarea', () => {
    it('should render the correct output when field is required', () => {
      const { asFragment } = setup(
        <Textarea required label="Test input" name="testInput" />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when error message is set', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Textarea
          label="Test input"
          name="testInput"
          errorMessage="This is an error"
        />,
      );

      await act(async () => {
        const parent = getByTestId('tooltip-parent-element');

        await user.hover(parent);
      });

      expect(asFragment()).toMatchSnapshot();
    });

    // TODO: This test needs improving
    it('should expand the textarea when content goes over one line', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Textarea
          label="Test input"
          name="testInput"
          data-testid="test-input"
        />,
      );

      const input = getByTestId('test-input');

      await user.type(input, 'This is line 1\nThis is line 2');

      expect(asFragment()).toMatchSnapshot();
    });

    describe.each(themes)('when theme is "$theme"', ({ theme }) => {
      it('should render the correct output', () => {
        const { asFragment } = setup(
          <Textarea label="Test input" name="testInput" theme={theme} />,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when help text is set', () => {
        const { asFragment } = setup(
          <Textarea
            label="Test input"
            name="testInput"
            helpText="This is a unit test"
            theme={theme}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it.each(sizing)(
        'should render the correct output when spacing is "$size"',
        ({ size }) => {
          const { asFragment } = setup(
            <Textarea
              label="Test input"
              name="testInput"
              spacing={size}
              theme={theme}
            />,
          );

          expect(asFragment()).toMatchSnapshot();
        },
      );
    });
  });

  describe('Upload', () => {
    it('should render the correct output when field is required', () => {
      const { asFragment } = setup(
        <Upload required label="Test input" name="testInput" />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when custom browse button text is set', () => {
      const { asFragment } = setup(
        <Upload buttonText="Select file" label="Test input" name="testInput" />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when error message is set', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Upload
          label="Test input"
          name="testInput"
          errorMessage="This is an error"
        />,
      );

      await act(async () => {
        const parent = getByTestId('tooltip-parent-element');

        await user.hover(parent);
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when a file is selected', async () => {
      const file = new File(['hello'], 'hello.png', {
        type: 'image/png',
      });

      const { asFragment, getByLabelText, user } = setup(
        <Upload label="Test input" name="testInput" />,
      );

      await act(async () => {
        const input = getByLabelText('Test input');

        await user.upload(input, file);
      });

      expect(asFragment()).toMatchSnapshot();
    });

    describe.each(themes)('when theme is "$theme"', ({ theme }) => {
      it('should render the correct output', () => {
        const { asFragment } = setup(
          <Upload label="Test input" name="testInput" theme={theme} />,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when help text is set', () => {
        const { asFragment } = setup(
          <Upload
            label="Test input"
            name="testInput"
            helpText="This is a unit test"
            theme={theme}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
