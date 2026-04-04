'use client';
import React from 'react';

export default function Arsenal() {
  const items = [
    {
      num: "01",
      name: "SELLING SYSTEMS",
      desc: "Apps that help businesses operate and make money daily.",
      tags: ["POS Systems", "Order Management", "Inventory Tracking", "Sales Analytics", "Daily Operations"],
      color: "bg-[var(--red)]"
    },
    {
      num: "02",
      name: "SCALABLE & SECURE BACKENDS",
      desc: "Reliable APIs, secure authentication, and data systems built for real growth.",
      tags: ["Secure Auth", "API Systems", "Data Integrity", "User Management", "High Availability"],
      color: "bg-[var(--yellow)]"
    },
    {
      num: "03",
      name: "CONVERSION WEB APPS",
      desc: "Dashboards and websites that users actually use.",
      tags: ["Admin Dashboards", "User Experience", "Fast Performance", "Mobile Responsive", "Lead Conversion"],
      color: "bg-[var(--blue)]"
    },
    {
      num: "04",
      name: "SAAS PRODUCTS",
      desc: "From idea to production with payments and scaling built in.",
      tags: ["Subscriptions", "Multi-Tenant", "Payment Systems", "User Roles", "Scalable Architecture"],
      color: "bg-[var(--primary)]"
    }

  ];

  return (
    <div id="arsenal">
      <div className="max-w-[1400px] mx-auto py-24 px-6 md:px-10">
        <div className="mb-2 flex items-center gap-2.5 text-[0.65rem] uppercase tracking-[0.3em] text-[#d6d2c8]">
          <span className="inline-block h-[2px] w-[25px] bg-[var(--primary)]" aria-hidden />
          What I Do
        </div>
        <h2 className="font-[family-name:var(--D)] text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.01em]">THE<br />ARSENAL</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.08] border border-white/[0.1] mt-14">
          {items.map((item, i) => (
            <div key={i} className="group ac bg-[var(--bg)] p-8 md:p-12 relative overflow-hidden transition-colors duration-200 hover:bg-[var(--bg2)] flex flex-col">
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${item.color} origin-bottom scale-y-0 transition-transform duration-300 group-hover:scale-y-100`}></div>
              <div className="font-[family-name:var(--D)] text-[6rem] text-[#f0ece0]/[0.03] absolute top-2 right-4 leading-none pointer-events-none transition-colors duration-250 group-hover:text-[#f0ece0]/[0.06]">{item.num}</div>
              <div className="font-[family-name:var(--D)] text-3xl text-[var(--fg)] mb-3 tracking-[0.03em] leading-none mt-4">{item.name}</div>
              <div className="text-[0.78rem] text-[#c4c0b6] leading-[1.75] flex-1 md:text-[0.8rem]">
                {item.desc}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-5">
                {item.tags.map(t => (
                  <span
                    key={t}
                    className="border border-white/[0.14] bg-white/[0.06] py-1 px-2.5 text-[0.6rem] uppercase tracking-[0.08em] text-[#c9c4ba] transition-all duration-200 group-hover:border-white/[0.22] group-hover:text-[var(--fg)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
