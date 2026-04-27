'use client';

import Link from 'next/link';

type PageHeroProps = {
  breadcrumbItems: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
  compact?: boolean;
  labelText?: string;
  labelIcon?: string;
};

export default function PageHero({
  breadcrumbItems,
  title,
  subtitle,
  compact = false,
  labelText,
  labelIcon,
}: PageHeroProps) {
  const paddingY = compact ? '52px 0 48px' : '60px 0 56px';

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
        padding: paddingY,
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {labelText && (
          <div
            style={{
              display: 'inline-flex',
              gap: '6px',
              alignItems: 'center',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--primary)',
              marginBottom: '12px',
            }}
          >
            {labelIcon && <i className={labelIcon} />}
            {labelText}
          </div>
        )}

        <nav
          className="page-hero-breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2px',
            fontSize: '13px',
            color: 'var(--gray-400)',
            marginBottom: '14px',
          }}
        >
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            return (
              <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                {index > 0 && (
                  <i
                    className="ri-arrow-right-s-line"
                    style={{ fontSize: '12px', color: 'var(--gray-600)' }}
                  />
                )}
                {isLast || !item.href ? (
                  <span
                    style={
                      isLast
                        ? { color: 'white', fontWeight: 600 }
                        : undefined
                    }
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        <h1
          className="page-hero-title"
          dangerouslySetInnerHTML={{ __html: title }}
          style={{
            fontSize: 'clamp(30px, 4.5vw, 48px)',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-.8px',
            lineHeight: 1.15,
            marginBottom: subtitle ? '14px' : 0,
          }}
        />

        {subtitle && (
          <p
            style={{
              fontSize: '16px',
              color: 'var(--gray-300)',
              lineHeight: 1.75,
              maxWidth: '760px',
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
