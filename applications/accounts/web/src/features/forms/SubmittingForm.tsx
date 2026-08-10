import type { FormEvent, ReactNode } from 'react';

export function SubmittingForm({
  children,
  className,
  onSubmit,
  submissionPending,
}: Readonly<{
  children: ReactNode;
  className: string;
  onSubmit: () => Promise<unknown>;
  submissionPending: boolean;
}>) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onSubmit().catch(() => undefined);
  };

  return (
    <form className={className} noValidate onSubmit={submit}>
      <fieldset className="contents" disabled={submissionPending}>
        {children}
      </fieldset>
    </form>
  );
}
