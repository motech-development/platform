import { forwardRef } from 'react';

const Overlay = forwardRef<HTMLDivElement>(({ children }, ref) => (
  <div
    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    ref={ref}
  >
    {children}
  </div>
));

export default Overlay;
