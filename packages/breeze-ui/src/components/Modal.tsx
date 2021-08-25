import { Dialog, Transition } from '@headlessui/react';
import {
  ElementType,
  Fragment,
  isValidElement,
  MutableRefObject,
  ReactNode,
} from 'react';
import { Box, PolymorphicComponentProps } from 'react-polymorphic-box';
import Overlay from './Overlay';
import Typography from './Typography';

interface IModalProps {
  content: ReactNode | string;
  footer: ReactNode;
  initialFocusRef?: MutableRefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  title: string;
  onDismiss: () => void;
}

export type TModalProps<E extends ElementType> = PolymorphicComponentProps<
  E,
  IModalProps
>;

const defaultElement = 'div';

const Modal = <E extends ElementType = typeof defaultElement>({
  content,
  footer,
  initialFocusRef,
  isOpen,
  onDismiss,
  title,
  ...rest
}: TModalProps<E>) => (
  <Transition.Root show={isOpen} as={Fragment}>
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      initialFocus={initialFocusRef}
      onClose={onDismiss}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay as={Overlay} />
        </Transition.Child>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <Box
            as={defaultElement}
            className="inline-block align-bottom bg-gray-100 px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rest}
          >
            <div>
              <div className="text-center">
                <Dialog.Title
                  rule
                  as={Typography}
                  align="center"
                  component="h3"
                  variant="h3"
                  margin="lg"
                >
                  {title}
                </Dialog.Title>

                <div className="mt-2">
                  {isValidElement(content) ? (
                    content
                  ) : (
                    <Typography
                      className="text-sm text-gray-500"
                      component="p"
                      variant="p"
                      margin="none"
                      align="center"
                    >
                      {content}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 grid-flow-row-dense">
              {footer}
            </div>
          </Box>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition.Root>
);

export default Modal;
