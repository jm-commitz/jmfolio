'use client';
export default function Interlude() {
  return (
    <div className="bg-[var(--red)] py-20 px-6 md:px-10 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-12">
        <div className="font-[family-name:var(--D)] text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] text-[var(--bg)] tracking-[-0.01em] relative z-10">
          BUILT FOR<br />
          <span className="text-transparent relative" style={{ WebkitTextStroke: '2px var(--bg)' }}>REAL</span><br />
          BUSINESS.
        </div>
        <div className="flex flex-col gap-6 items-start md:items-end relative z-10">
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--bg)] border-2 border-[var(--bg)] py-2 px-4 font-[family-name:var(--M)] font-bold">Built SaaS used by real businesses</div>
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--bg)] border-2 border-[var(--bg)] py-2 px-4 font-[family-name:var(--M)] font-bold">From idea → deployed → scaling</div>
          <div className="font-[family-name:var(--D)] text-[6rem] md:text-9xl text-[#0a0a0a]/15 leading-none">★</div>
        </div>
      </div>
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 font-[family-name:var(--D)] text-[18rem] text-[#0a0a0a]/[0.08] pointer-events-none z-0">★</div>
    </div>
  );
}
