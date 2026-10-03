export const fieldVariants = {
  base: {
    choiceDescription:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-normal breeze:leading-[calc(1/0.75)] breeze:text-breeze-ink-3',
    choiceError:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-normal breeze:leading-[calc(1/0.75)] breeze:text-breeze-danger',
    control:
      'breeze:relative breeze:inline-grid breeze:min-inline-0 breeze:inline-full',
    description:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-normal breeze:leading-breeze-snug breeze:text-breeze-ink-3',
    error:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-normal breeze:leading-breeze-snug breeze:text-breeze-danger',
    input:
      'breeze:min-inline-0 breeze:inline-full breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:font-breeze-sans breeze:text-breeze-ink breeze:outline-none breeze:placeholder:text-breeze-ink-3 breeze:data-[invalid]:border-breeze-danger breeze:data-[focused]:border-breeze-brand breeze:data-[focused]:ring-3 breeze:data-[focused]:ring-breeze-brand/15 breeze:data-[focused]:outline-hidden breeze:disabled:cursor-not-allowed breeze:disabled:bg-breeze-sunken breeze:disabled:opacity-60 breeze:read-only:cursor-default breeze:read-only:bg-breeze-sunken breeze:read-only:text-breeze-ink-2',
    label:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-medium breeze:leading-breeze-snug breeze:text-breeze-ink-3',
    root: 'breeze:flex breeze:min-inline-0 breeze:flex-col breeze:gap-breeze-1',
    skeleton:
      'breeze:pointer-events-none breeze:absolute breeze:[inset-block:0] breeze:[inset-inline:0]',
    // Select and DatePicker announce read-only as aria-disabled.
    trigger:
      'breeze:flex breeze:min-block-breeze-md breeze:any-pointer-coarse:min-block-breeze-tap breeze:min-inline-0 breeze:inline-full breeze:items-center breeze:justify-between breeze:gap-breeze-2 breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2 breeze:font-breeze-sans breeze:text-breeze-sm breeze:text-breeze-ink breeze:outline-none breeze:data-[invalid]:border-breeze-danger breeze:data-[focused]:border-breeze-brand breeze:data-[focused]:ring-3 breeze:data-[focused]:ring-breeze-brand/15 breeze:data-[focused]:outline-hidden breeze:aria-disabled:cursor-default breeze:aria-disabled:bg-breeze-sunken breeze:aria-disabled:text-breeze-ink-2 breeze:disabled:cursor-not-allowed breeze:disabled:bg-breeze-sunken breeze:disabled:opacity-60',
  },
  compound: {},
  size: {
    md: 'breeze:min-block-breeze-md breeze:any-pointer-coarse:min-block-breeze-tap breeze:text-breeze-sm breeze:leading-breeze-snug',
  },
  state: {
    loadingInput: 'breeze:!opacity-0',
  },
  variant: {},
} as const;

export function joinClassNames(
  ...classNames: Array<string | false | undefined>
): string {
  return classNames.filter(Boolean).join(' ');
}
