export function PurinaLogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div
      className={`${className} grid grid-cols-3 grid-rows-3 gap-0.5 rounded-lg border-2 border-primary bg-surface p-1 shadow-sm`}
      aria-label="Brand mark"
      role="img"
    >
      <span className="rounded-[2px] bg-primary" />
      <span className="rounded-[2px] bg-surface" />
      <span className="rounded-[2px] bg-primary" />
      <span className="rounded-[2px] bg-surface" />
      <span className="rounded-[2px] bg-primary" />
      <span className="rounded-[2px] bg-surface" />
      <span className="rounded-[2px] bg-primary" />
      <span className="rounded-[2px] bg-surface" />
      <span className="rounded-[2px] bg-primary" />
    </div>
  );
}
