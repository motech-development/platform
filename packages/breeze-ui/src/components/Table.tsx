import { FC, TableHTMLAttributes } from 'react';
import { classNames } from '../utils/className';

export interface ITableProps extends TableHTMLAttributes<HTMLTableElement> {
  fixed?: boolean;
}

const Table: FC<ITableProps> = ({ className = '', fixed = false, ...rest }) => (
  <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200">
          <table
            className={classNames(
              'min-w-full',
              className,
              fixed ? 'table-fixed' : 'table-auto',
            )}
            {...rest}
          />
        </div>
      </div>
    </div>
  </div>
);

export default Table;
