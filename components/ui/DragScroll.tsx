'use client';

import { useRef, type HTMLAttributes, type PointerEvent } from 'react';

// Horizontal scroller you can drag with the mouse. Touch already swipes
// natively, so only mouse pointers are handled here.
export default function DragScroll({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number } | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !ref.current) return;
    drag.current = { x: e.clientX, scroll: ref.current.scrollLeft };
    ref.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !ref.current) return;
    // Relative to the start position, so it also works with dir="rtl".
    ref.current.scrollLeft = drag.current.scroll - (e.clientX - drag.current.x);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !ref.current) return;
    drag.current = null;
    ref.current.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`cursor-grab select-none active:cursor-grabbing ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
