import { useEffect, useRef } from 'react';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import ToastProvider, { useToast } from './ToastProvider';

const ToastFixture = () => {
  const toast = useToast();
  const hasAddedToast = useRef(false);

  useEffect(() => {
    if (!hasAddedToast.current) {
      hasAddedToast.current = true;

      toast.add({
        colour: 'success',
        message: 'Saved successfully',
      });
    }
  }, [toast]);

  return <Button colour="success">Save changes</Button>;
};

export default {
  component: ToastProvider,
};

export const VisibleToast = {
  name: 'Visible toast',
  render: () => (
    <>
      <BaseStyles />

      <ToastProvider>
        <ToastFixture />
      </ToastProvider>
    </>
  ),
};
