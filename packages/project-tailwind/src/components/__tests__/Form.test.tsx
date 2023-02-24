import { act, fireEvent, render } from '@testing-library/react';
import { mockViewport } from 'jsdom-testing-mocks';
import { TextInput } from '../Form';
import { sizing, themes } from '../../utilities/jest';

const types = ['text', 'email', 'password', 'tel'] as const;

describe('Form', () => {
  beforeAll(() => {
    mockViewport({
      height: '768px',
      width: '1024px',
    });
  });

  describe('TextInput', () => {
    it.each(types)(
      'should render the correct output when type is "%s"',
      (type) => {
        const { asFragment } = render(
          <TextInput label="Test input" name="testInput" type={type} />,
        );

        expect(asFragment()).toMatchSnapshot();
      },
    );

    it('should render the correct output when field is required', () => {
      const { asFragment } = render(
        <TextInput required label="Test input" name="testInput" />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when decimal scale is set', async () => {
      const { asFragment, findByLabelText } = render(
        <TextInput label="Test input" name="testInput" decimalScale={2} />,
      );

      const input = await findByLabelText('Test input');

      fireEvent.change(input, {
        target: {
          value: '100',
        },
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when format is set', async () => {
      const { asFragment, findByLabelText } = render(
        <TextInput label="Test input" name="testInput" format="##-##-##" />,
      );

      const input = await findByLabelText('Test input');

      fireEvent.change(input, {
        target: {
          value: '123456',
        },
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when prefix is set', async () => {
      const { asFragment, findByLabelText } = render(
        <TextInput label="Test input" name="testInput" prefix="£" />,
      );

      const input = await findByLabelText('Test input');

      fireEvent.change(input, {
        target: {
          value: '100',
        },
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when suffix is set', async () => {
      const { asFragment, findByLabelText } = render(
        <TextInput label="Test input" name="testInput" suffix="px" />,
      );

      const input = await findByLabelText('Test input');

      fireEvent.change(input, {
        target: {
          value: '100',
        },
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when error message is set', async () => {
      const { asFragment, findByTestId } = render(
        <TextInput
          label="Test input"
          name="testInput"
          errorMessage="This is an error"
        />,
      );

      await act(async () => {
        const parent = await findByTestId('tooltip-parent-element');

        fireEvent.mouseEnter(parent);
      });

      expect(asFragment()).toMatchSnapshot();
    });

    describe.each(themes)('when theme is "$theme"', ({ theme }) => {
      it('should render the correct output', () => {
        const { asFragment } = render(
          <TextInput label="Test input" name="testInput" theme={theme} />,
        );

        expect(asFragment()).toMatchSnapshot();
      });

      it('should render the correct output when help text is set', () => {
        const { asFragment } = render(
          <TextInput
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
          const { asFragment } = render(
            <TextInput
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
});
