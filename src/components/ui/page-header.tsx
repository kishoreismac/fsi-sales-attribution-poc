export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="ui-page-header flex flex-col gap-5 border-b border-border/80 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="ui-page-eyebrow inline-flex min-h-7 items-center rounded-md border border-primary/15 bg-primary/10 px-2.5 text-xs font-bold uppercase text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="ui-page-title mt-3 text-2xl font-semibold tracking-normal text-foreground sm:text-[32px] sm:leading-tight">{title}</h1>
        {description ? <p className="ui-page-description mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
