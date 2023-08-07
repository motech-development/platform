import { mockViewport } from 'jsdom-testing-mocks';
import { act } from '@testing-library/react';
import { Input, Radio, Select, Textarea, Upload } from '../Form';
import { setup, sizing, themes } from '../../utilities/jest';

describe('Form', () => {
  beforeAll(() => {
    mockViewport({
      height: '768px',
      width: '1024px',
    });
  });

  describe('Input', () => {
    const types = ['text', 'email', 'password', 'tel'] as const;

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

    it('should render the correct output when input is disabled', () => {
      const { asFragment } = setup(
        <Upload
          disabled
          buttonText="Select file"
          label="Test input"
          name="testInput"
        />,
      );

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

      it.each(sizing)(
        'should render the correct output when spacing is "$size"',
        ({ size }) => {
          const { asFragment } = setup(
            <Upload
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

  describe('Radio', () => {
    const options = [
      {
        label: '4 GB',
        value: '4',
      },
      {
        label: '8 GB',
        value: '8',
      },
      {
        label: '16 GB',
        value: '16',
      },
      {
        label: '32 GB',
        value: '32',
      },
      {
        label: '64 GB',
        value: '64',
      },
      {
        disabled: true,
        label: '128 GB',
        value: '128',
      },
    ];

    it('should render the correct output when field is required', () => {
      const { asFragment } = setup(
        <Radio
          required
          label="Test input"
          name="testInput"
          options={options}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when error message is set', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Radio
          errorMessage="This is an error"
          label="Test input"
          name="testInput"
          options={options}
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
          <Radio
            label="Test input"
            name="testInput"
            options={options}
            theme={theme}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when help text is set', () => {
        const { asFragment } = setup(
          <Radio
            label="Test input"
            name="testInput"
            helpText="This is a unit test"
            options={options}
            theme={theme}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when an item is selected', async () => {
        const { asFragment, getByLabelText, user } = setup(
          <Radio
            label="Test input"
            name="testInput"
            options={options}
            theme={theme}
          />,
        );

        await act(async () => {
          const option = getByLabelText('16 GB');

          await user.click(option);

          const other = getByLabelText('128 GB');

          await user.click(other);
        });

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when an item is active', async () => {
        const { asFragment, getByLabelText, user } = setup(
          <Radio
            label="Test input"
            name="testInput"
            options={options}
            theme={theme}
          />,
        );

        await act(async () => {
          const option = getByLabelText('16 GB');

          await user.click(option);
        });

        expect(asFragment()).toMatchSnapshot();
      });

      it.each(sizing)(
        'should render the correct output when spacing is "$size"',
        ({ size }) => {
          const { asFragment } = setup(
            <Radio
              label="Test input"
              name="testInput"
              options={options}
              spacing={size}
              theme={theme}
            />,
          );

          expect(asFragment()).toMatchSnapshot();
        },
      );
    });
  });

  describe('Select', () => {
    const options = [
      {
        disabled: true,
        label: 'Select an option',
        value: '',
      },
      {
        label: '4 GB',
        value: '4',
      },
      {
        label: '8 GB',
        value: '8',
      },
      {
        label: '16 GB',
        value: '16',
      },
      {
        label: '32 GB',
        value: '32',
      },
      {
        label: '64 GB',
        value: '64',
      },
      {
        disabled: true,
        label: '128 GB',
        value: '128',
      },
    ];

    it('should render the correct output when field is required', () => {
      const { asFragment } = setup(
        <Select
          required
          label="Test input"
          name="testInput"
          options={options}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when error message is set', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Select
          errorMessage="This is an error"
          label="Test input"
          name="testInput"
          options={options}
        />,
      );

      await act(async () => {
        const parent = getByTestId('tooltip-parent-element');

        await user.hover(parent);
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when field is disabled', () => {
      const { asFragment } = setup(
        <Select
          disabled
          label="Test input"
          name="testInput"
          options={options}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when menu is open', async () => {
      const { asFragment, getByTestId, user } = setup(
        <Select label="Test input" name="testInput" options={options} />,
      );

      await act(async () => {
        const parent = getByTestId('select-button');

        await user.click(parent);
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should select the correct option', async () => {
      const { asFragment, getByTestId, getByText, user } = setup(
        <Select label="Test input" name="testInput" options={options} />,
      );

      const firstRender = asFragment();

      await act(async () => {
        const parent = getByTestId('select-button');

        await user.click(parent);
      });

      await act(async () => {
        const item = getByText('64 GB');

        await user.click(item);
      });

      expect(firstRender).toMatchDiffSnapshot(asFragment());
    });

    describe.each(themes)('when theme is "$theme"', ({ theme }) => {
      it('should render the correct output', () => {
        const { asFragment } = setup(
          <Select
            label="Test input"
            name="testInput"
            options={options}
            theme={theme}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when help text is set', () => {
        const { asFragment } = setup(
          <Select
            label="Test input"
            name="testInput"
            helpText="This is a unit test"
            options={options}
            theme={theme}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it.each(sizing)(
        'should render the correct output when spacing is "$size"',
        ({ size }) => {
          const { asFragment } = setup(
            <Select
              label="Test input"
              name="testInput"
              options={options}
              spacing={size}
              theme={theme}
            />,
          );

          expect(asFragment()).toMatchSnapshot();
        },
      );
    });
  });
});
