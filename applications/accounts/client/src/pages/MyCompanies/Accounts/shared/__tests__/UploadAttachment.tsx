import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { Form, Formik } from 'formik';
import { GraphQLError } from 'graphql';
import TestProvider from '../../../../../utils/TestProvider';
import UploadAttachment, { REQUEST_UPLOAD } from '../UploadAttachment';

interface IInitialValues {
  test: string;
}

describe('UploadAttachment', () => {
  let component: RenderResult;
  let file: File;
  let initialValues: IInitialValues;
  let mocks: MockedResponse[];
  let onSubmit: jest.Mock;
  let onUpload: jest.Mock;

  beforeEach(() => {
    initialValues = {
      test: '',
    };

    mocks = [
      {
        request: {
          query: REQUEST_UPLOAD,
          variables: {
            id: 'test',
            input: {
              contentType: 'image/pdf',
              extension: 'pdf',
            },
          },
        },
        result: {
          errors: [new GraphQLError('Error!')],
        },
      },
    ];

    onSubmit = jest.fn();

    onUpload = jest.fn();

    component = render(
      <TestProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => (
              <Form>
                <UploadAttachment id="test" name="test" onUpload={onUpload} />
              </Form>
            )}
          </Formik>
        </MockedProvider>
      </TestProvider>,
    );
  });

  it('should do nothing if file does not have an extension', async () => {
    const { findByLabelText } = component;

    file = new File(['dummy content'], 'example', {
      type: 'image/pdf',
    });

    await act(async () => {
      const upload = await findByLabelText(
        'transaction-form.upload.upload.label',
      );

      Object.defineProperty(upload, 'files', {
        value: [file],
      });

      fireEvent.change(upload);
    });

    expect(onUpload).not.toHaveBeenCalled();
  });

  it('should do nothing if no upload URL is returned', async () => {
    const { findByLabelText } = component;

    file = new File(['dummy content'], 'example.pdf', {
      type: 'image/pdf',
    });

    await act(async () => {
      const upload = await findByLabelText(
        'transaction-form.upload.upload.label',
      );

      Object.defineProperty(upload, 'files', {
        value: [file],
      });

      fireEvent.change(upload);
    });

    expect(onUpload).not.toHaveBeenCalled();
  });
});
