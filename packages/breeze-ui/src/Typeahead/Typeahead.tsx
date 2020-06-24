import { FormikProps, FormikValues } from 'formik';
import React, { FC, memo, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';
import Button from '../Button/Button';
import useOutsideClick from '../hooks/useOutsideClick';
import TextBox, { ITextBoxProps } from '../TextBox/TextBox';

const TypeaheadWrapper = styled.div`
  position: relative;
`;

const Suggestions = styled.div`
  width: 100%;
  z-index: 10;
`;

const Suggestion = styled(Button)`
  padding-left: 8px;
  padding-right: 8px;
  text-align: left;
`;

export interface ITypeaheadSuggestion {
  name: string;
  value: string;
}

export interface ITypeaheadProps
  extends Omit<ITextBoxProps, 'type' | 'onChange'> {
  suggestions: ITypeaheadSuggestion[];
}

const Typeahead: FC<ITypeaheadProps> = ({ suggestions, ...rest }) => {
  const { name } = rest;
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [
    referenceElement,
    setReferenceElement,
  ] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<FormikProps<FormikValues>>();
  const { attributes, styles } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
  });
  const setValue = (value: string) => {
    if (form) {
      form.setFieldValue(name, value);
    }

    setVisible(false);
  };

  useOutsideClick(referenceElement, () => {
    setVisible(false);
  });

  return (
    <TypeaheadWrapper ref={setReferenceElement}>
      <TextBox
        type="text"
        onChange={(e, context) => {
          if (!form) {
            setForm(context);
          }

          const input = e.currentTarget.value;
          const filter = suggestions.filter(
            ({ name: suggestion }) =>
              suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1,
          );

          setFilteredSuggestions(filter);

          if (visible) {
            setVisible(!!input);
          } else {
            setVisible(true);
          }
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />

      {visible && (
        <Suggestions
          ref={setPopperElement}
          style={styles.popper}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...attributes.popper}
        >
          {filteredSuggestions.map(({ name: suggestion, value }) => (
            <Suggestion
              block
              key={value}
              colour="secondary"
              size="sm"
              onClick={() => setValue(value)}
            >
              {suggestion}
            </Suggestion>
          ))}
        </Suggestions>
      )}
    </TypeaheadWrapper>
  );
};

export default memo(Typeahead);
