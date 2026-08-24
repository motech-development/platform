const compactCellClassName = 'max-sm:border-0! max-sm:p-0!';

export const compactTableOnlyClassName = 'sm:hidden!';

export const responsiveEntityTableClassNames = {
  body: 'max-sm:block!',
  cells: {
    actions: `${compactCellClassName} max-sm:col-start-3! max-sm:row-start-1 max-sm:flex! max-sm:justify-end`,
    identity: `${compactCellClassName} max-sm:col-start-1! max-sm:row-start-1 max-sm:flex!`,
    primary: `${compactCellClassName} max-sm:col-start-2! max-sm:row-start-1 max-sm:flex!`,
    secondary: `${compactCellClassName} max-sm:col-span-3! max-sm:row-start-2 max-sm:block! max-sm:before:inline-block!`,
    tertiary: `${compactCellClassName} max-sm:col-span-3! max-sm:row-start-3 max-sm:block! max-sm:before:inline-block!`,
  },
  header: 'max-sm:hidden!',
  root: 'max-sm:block!',
  row: 'max-sm:grid! max-sm:grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] max-sm:items-center! max-sm:gap-x-3! max-sm:gap-y-2! max-sm:px-4 max-sm:py-4',
} as const;
