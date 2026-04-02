'use client';
import React from 'react';

export default function WhyChooseMe() {
  const reasons = [
    { num: "01 —", name: "FULL-STACK OWNERSHIP", desc: "Flutter mobile to Laravel backend to Next.js frontend. One developer, full ownership. No handoff friction, no communication overhead." },
    { num: "02 —", name: "LOCAL MARKET EXPERTISE", desc: "Deep experience with Philippine SMBs. I know the market, the constraints, and what features actually matter to a sari-sari or karinderia owner." },
    { num: "03 —", name: "BUILT RIGHT FIRST", desc: "UUID keys, soft deletes, OAuth2, price snapshotting, device binding. Proper architecture from the start — no technical debt, no emergency rewrites." },
    { num: "04 —", name: "SCALES WITH YOU", desc: "Multi-tenant SaaS architecture designed to grow. 10 users or 10,000 — the system handles it without burning everything down and rebuilding." }
  ];

  return (
    <div id="why" className="bg-[var(--bg3)] border-t border-[#f0ece0]/[0.06]">
      <div className="max-w-[1400px] mx-auto py-24 px-6 md:px-10">
        <div className="text-[0.65rem] text-[var(--red)] uppercase tracking-[0.3em] mb-2 flex items-center gap-2.5">
          <span className="w-[25px] h-[2px] bg-[var(--red)] inline-block"></span>The Case For Me
        </div>
        <h2 className="font-[family-name:var(--D)] text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.01em]">WHY<br />CHOOSE<br />ME?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#f0ece0]/[0.06] border border-[#f0ece0]/[0.06] mt-14">
          {reasons.map((r, i) => (
            <div key={i} className="wc group bg-[var(--bg3)] p-11 md:p-8 relative overflow-hidden transition-colors duration-200 hover:bg-[var(--bg2)] flex flex-col gap-2">
              <div className="font-[family-name:var(--M)] text-[0.78rem] text-[var(--fg3)] tracking-[0.1em] transition-colors duration-200 group-hover:text-[var(--red)]">{r.num}</div>
              <div className="font-[family-name:var(--D)] text-[1.65rem] text-[var(--fg)] leading-none tracking-[0.03em] mt-1">{r.name}</div>
              <div className="text-[0.72rem] text-[var(--fg2)] leading-[1.75] mt-2 flex-1">{r.desc}</div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-solid border-t-0 border-r-0 border-b-[40px] border-l-[40px] border-[transparent_transparent_var(--bg)_transparent] pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
