'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface Transform {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.3;
const MAX_SCALE = 1.8;
const FIT_MIN_SCALE = 0.6;
const FIT_MAX_SCALE = 1.15;

export function usePanZoom(contentSize: { width: number; height: number }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const panState = useRef<{ panning: boolean; moved: boolean; startX: number; startY: number; startTX: number; startTY: number }>({
    panning: false,
    moved: false,
    startX: 0,
    startY: 0,
    startTX: 0,
    startTY: 0,
  });

  const zoomBy = useCallback((factor: number, clientX?: number, clientY?: number) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const mx = clientX != null ? clientX - rect.left : rect.width / 2;
    const my = clientY != null ? clientY - rect.top : rect.height / 2;
    setTransform((t) => {
      const worldX = (mx - t.x) / t.scale;
      const worldY = (my - t.y) / t.scale;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, t.scale * factor));
      return { scale: newScale, x: mx - worldX * newScale, y: my - worldY * newScale };
    });
  }, []);

  const fitToScreen = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp || !contentSize.width || !contentSize.height) return;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const ideal = Math.min(vw / (contentSize.width + 80), vh / (contentSize.height + 80));
    // Never auto-shrink below a legible scale — better to let big plans overflow
    // and be pannable than to render illegible text.
    const scale = Math.max(FIT_MIN_SCALE, Math.min(FIT_MAX_SCALE, ideal));
    setTransform({
      scale,
      x: Math.max(12, (vw - contentSize.width * scale) / 2),
      y: 20,
    });
  }, [contentSize.width, contentSize.height]);

  const onPointerDownBackground = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.plan-card')) return;
    const vp = viewportRef.current;
    panState.current = {
      panning: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startTX: transform.x,
      startTY: transform.y,
    };
    vp?.setPointerCapture(e.pointerId);
  }, [transform.x, transform.y]);

  const onPointerMoveBackground = useCallback((e: React.PointerEvent) => {
    const s = panState.current;
    if (!s.panning) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) s.moved = true;
    setTransform((t) => ({ ...t, x: s.startTX + dx, y: s.startTY + dy }));
  }, []);

  const onPointerUpBackground = useCallback((onEmptyClick?: () => void) => {
    const s = panState.current;
    if (s.panning && !s.moved) onEmptyClick?.();
    s.panning = false;
  }, []);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 1.1 : 0.9, e.clientX, e.clientY);
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, [zoomBy]);

  return {
    viewportRef,
    transform,
    zoomBy,
    fitToScreen,
    onPointerDownBackground,
    onPointerMoveBackground,
    onPointerUpBackground,
  };
}
