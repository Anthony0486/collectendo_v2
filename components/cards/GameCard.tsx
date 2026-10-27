type GameCardProps = {
  title: string;
  platform: string;
  releaseDate: string;
  cover?: string;
  tag?: string;
};

export function GameCard({ title, platform, releaseDate, cover, tag }: GameCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-red-100 bg-[#f5f5f5] shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#e60012]/40">
      <div className="relative overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-red-50/60 px-4 text-center text-xs font-medium text-slate-400">
            Pas d’image disponible
          </div>
        )}
        {tag ? (
          <span className="absolute left-3 top-3 rounded-full border border-[#e60012]/30 bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#e60012]">
            {tag}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">{title}</h3>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-700">
          <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-[#e60012] ring-1 ring-red-100">
            {platform}
          </span>
          <span className="text-slate-500">{releaseDate}</span>
        </div>
      </div>
    </article>
  );
}
