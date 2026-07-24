import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
};

export function LazyImage({ src, alt, className = '', aspectClass = '', ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${aspectClass} ${className}`}>
      {visible && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          {...rest}
        />
      )}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-700 animate-pulse" />
      )}
    </div>
  );
}
