export default function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-white/65 max-w-xl">{subtitle}</div> : null}
      </div>

      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  );
}
