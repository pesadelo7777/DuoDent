"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type FrameSequenceProps = {
  id: string;
  className?: string;
  desktopCount: number;
  mobileCount: number;
  desktopPath: string;
  mobilePath: string;
  desktopPoster: string;
  mobilePoster: string;
  fallbackVideo: string;
  ariaLabel: string;
  children?: (progress: number) => ReactNode;
};

function frameUrl(base: string, index: number) {
  return `${base}/frame-${String(index + 1).padStart(3, "0")}.webp`;
}

export function FrameSequence({
  id,
  className = "",
  desktopCount,
  mobileCount,
  desktopPath,
  mobilePath,
  desktopPoster,
  mobilePoster,
  fallbackVideo,
  ariaLabel,
  children,
}: FrameSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCache = useRef(new Map<string, HTMLImageElement>());
  const targetProgress = useRef(0);
  const renderedProgress = useRef(0);
  const lastPublishedProgress = useRef(-1);
  const visible = useRef(true);
  const rafId = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fallbackPath, setFallbackPath] = useState<string | null>(null);

  const count = isMobile ? mobileCount : desktopCount;
  const path = isMobile ? mobilePath : desktopPath;
  const fallback = fallbackPath === path;

  const draw = useCallback(
    (image: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas || !image.naturalWidth) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      let context: CanvasRenderingContext2D | null = null;
      try {
        context = canvas.getContext("2d", { alpha: false });
      } catch {
        context = canvas.getContext("2d");
      }
      if (!context) return;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.drawImage(
        image,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
    },
    [],
  );

  const loadFrame = useCallback(
    (index: number, shouldDraw = false) => {
      const safeIndex = Math.max(0, Math.min(count - 1, index));
      const url = frameUrl(path, safeIndex);
      const cached = imageCache.current.get(url);
      if (cached) {
        if (shouldDraw && cached.complete) draw(cached);
        return;
      }

      const image = new Image();
      image.decoding = "async";
      image.src = url;
      image.onload = () => {
        if (shouldDraw) draw(image);
      };
      image.onerror = () => setFallbackPath(path);
      imageCache.current.set(url, image);
    },
    [count, draw, path],
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 720px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    sync();

    const subscribe = (query: MediaQueryList) => {
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", sync);
        return () => query.removeEventListener("change", sync);
      }
      query.addListener(sync);
      return () => query.removeListener(sync);
    };

    const unsubscribeMobile = subscribe(mobileQuery);
    const unsubscribeMotion = subscribe(motionQuery);
    return () => {
      unsubscribeMobile();
      unsubscribeMotion();
    };
  }, []);

  useEffect(() => {
    imageCache.current.clear();
    for (let index = 0; index < Math.min(4, count); index += 1) {
      loadFrame(index, index === 0);
    }

    const preloadTimer = window.setTimeout(() => {
      const preloadCount = isMobile ? count : Math.min(count, 12);
      for (let index = 4; index < preloadCount; index += 1) loadFrame(index);
    }, 180);

    return () => window.clearTimeout(preloadTimer);
  }, [count, isMobile, loadFrame, path]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      visible.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { rootMargin: "30% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateTarget = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const distance = Math.max(1, section.offsetHeight - viewportHeight);
      targetProgress.current = Math.max(0, Math.min(1, -rect.top / distance));
    };

    const render = () => {
      if (visible.current) {
        const delta = targetProgress.current - renderedProgress.current;
        renderedProgress.current = reducedMotion
          ? targetProgress.current
          : renderedProgress.current + delta * 0.16;
        if (Math.abs(delta) < 0.001) renderedProgress.current = targetProgress.current;
        const nextProgress = renderedProgress.current;

        if (!fallback) {
          const index = Math.round(nextProgress * (count - 1));
          loadFrame(index, true);
          loadFrame(index + 1);
          loadFrame(index + 2);
          loadFrame(index - 1);
        }

        if (
          Math.abs(nextProgress - lastPublishedProgress.current) >= 0.002 ||
          nextProgress === 0 ||
          nextProgress === 1
        ) {
          lastPublishedProgress.current = nextProgress;
          setProgress(nextProgress);
        }
      }
      rafId.current = requestAnimationFrame(render);
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    rafId.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [count, fallback, loadFrame, reducedMotion]);

  const style = { "--sequence-progress": progress } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`frame-sequence ${className}`}
      style={style}
      aria-label={ariaLabel}
    >
      <div className="frame-sticky">
        <picture className="frame-poster">
          <source media="(max-width: 720px)" srcSet={mobilePoster} />
          <img src={desktopPoster} alt="" fetchPriority="high" />
        </picture>
        {!fallback && (
          <canvas ref={canvasRef} className="frame-canvas" aria-hidden="true" />
        )}
        {fallback && (
          <video
            className="frame-video"
            src={fallbackVideo}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            aria-hidden="true"
          />
        )}
        <div className="frame-scrim" aria-hidden="true" />
        {children?.(progress)}
      </div>
    </section>
  );
}
