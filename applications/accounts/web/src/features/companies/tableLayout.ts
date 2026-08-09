const compactCellClassName = 'max-[681px]:!border-0 max-[681px]:!p-0';

export const companiesTableClassNames = {
  body: 'max-[681px]:!block',
  cells: {
    actions: `${compactCellClassName} max-[681px]:col-start-3 max-[681px]:row-start-1 max-[681px]:!flex max-[681px]:justify-end`,
    avatar: `${compactCellClassName} max-[681px]:col-start-1 max-[681px]:row-start-1 max-[681px]:!flex`,
    company: `${compactCellClassName} max-[681px]:col-start-2 max-[681px]:row-start-1 max-[681px]:!flex`,
    contact: `${compactCellClassName} max-[681px]:col-span-3 max-[681px]:row-start-3 max-[681px]:!block max-[681px]:before:!inline-block`,
    number: `${compactCellClassName} max-[681px]:col-span-3 max-[681px]:row-start-2 max-[681px]:!block max-[681px]:before:!inline-block`,
  },
  header: 'max-[681px]:!hidden',
  root: 'max-[681px]:!block',
  row: 'max-[681px]:!grid max-[681px]:grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] max-[681px]:!items-center max-[681px]:!gap-x-3 max-[681px]:!gap-y-2 max-[681px]:px-4 max-[681px]:py-4',
} as const;
