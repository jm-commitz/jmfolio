import Image from 'next/image';

// Monochrome device mockups for screenshots: a MacBook for desktop captures
// and an iPhone (with Dynamic Island) for phone captures. Pure markup + CSS,
// so they work in server and client components alike.

type ShotProps = {
  src: string;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * iPhone-style Dynamic Island. Sized relative to its screen. `live` stretches
 * it into a Live Activity with a pulsing dot when an ancestor `group` is hovered.
 */
export function DynamicIsland({ live = false }: { live?: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute left-1/2 top-[2.2%] z-10 flex h-[4.4%] w-[34%] -translate-x-1/2 items-center justify-end rounded-full bg-black px-[3.5%] shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${
        live
          ? 'transition-[width] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:w-[60%]'
          : ''
      }`}
    >
      {live && (
        <span className="absolute left-[9%] flex aspect-square h-[42%] opacity-0 transition-opacity delay-150 duration-300 group-hover:opacity-100">
          <span className="h-full w-full animate-pulse rounded-full bg-[#30d158]" />
        </span>
      )}
      {/* Front camera */}
      <span className="aspect-square h-[46%] rounded-full bg-[#14141f] ring-1 ring-white/10" />
    </span>
  );
}

/** MacBook: black bezel with camera notch over a slim aluminium base. */
export function MacBook({ src, alt = '', sizes, priority, className = '' }: ShotProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Lid */}
      <div className="relative rounded-t-[3.5%] bg-[#0b0b0b] p-[2.2%] pb-[2.6%] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-[#2a2a2a]">
        {/* Camera notch */}
        <span
          aria-hidden
          className="absolute left-1/2 top-0 z-10 h-[3.2%] w-[11%] -translate-x-1/2 rounded-b-[40%] bg-[#0b0b0b]"
        >
          <span className="absolute left-1/2 top-1/2 aspect-square h-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1c1c28]" />
        </span>
        <div className="relative aspect-[1919/946] overflow-hidden rounded-[1.2%] bg-black">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-top"
          />
        </div>
      </div>
      {/* Base: wider than the lid (height via padding = % of width), with the
          opening lip in the middle */}
      <div
        aria-hidden
        className="relative -mx-[6%] h-0 pt-[3%] rounded-b-[45%_100%] bg-gradient-to-b from-[#d9d9d9] via-[#a9a9a9] to-[#6f6f6f] dark:from-[#5a5a5a] dark:via-[#3d3d3d] dark:to-[#232323]"
      >
        <span className="absolute left-1/2 top-0 h-[45%] w-[16%] -translate-x-1/2 rounded-b-[40%] bg-black/25" />
      </div>
    </div>
  );
}

/** iPhone: rounded black body, inset screen and a Dynamic Island. */
export function IPhone({
  src,
  alt = '',
  sizes,
  priority,
  className = '',
  liveIsland = false,
}: ShotProps & { liveIsland?: boolean }) {
  return (
    <div
      className={`relative aspect-[9/19.5] rounded-[16%/7.4%] bg-[#0b0b0b] p-[3.2%] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] ring-1 ring-[#2a2a2a] ${className}`}
    >
      {/* Side buttons */}
      <span aria-hidden className="absolute -left-[1.6%] top-[18%] h-[6%] w-[1.6%] rounded-l bg-[#2a2a2a]" />
      <span aria-hidden className="absolute -left-[1.6%] top-[27%] h-[10%] w-[1.6%] rounded-l bg-[#2a2a2a]" />
      <span aria-hidden className="absolute -right-[1.6%] top-[24%] h-[13%] w-[1.6%] rounded-r bg-[#2a2a2a]" />
      <div className="relative h-full w-full overflow-hidden rounded-[13%/6%] bg-black">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
        <DynamicIsland live={liveIsland} />
      </div>
    </div>
  );
}
