import { forwardRef, ReactNode } from 'react';

export interface IOverlayProps {
  children: ReactNode;
}

const Overlay = forwardRef<HTMLDivElement, IOverlayProps>(
  ({ children }, ref) => (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      ref={ref}
    >
      {children}
    </div>
  ),
);

export default Overlay;
