import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lms-platform-ten-coral.vercel.app'),
  title: '조선힙합소리꾼 공식 홈페이지 & 무료 나눔 허브',
  description:
    '가슴을 울리는 조선힙합소리꾼 명곡 연속듣기 · AI 영상제작 비법 · 유용한 자동화 프로그램 100% 무료 나눔터',
  openGraph: {
    title: '조선힙합소리꾼 공식 홈페이지 & 무료 나눔 허브',
    description:
      '가슴을 울리는 조선힙합소리꾼 명곡 연속듣기 · AI 영상제작 비법 · 유용한 자동화 프로그램 100% 무료 나눔터',
    url: 'https://lms-platform-ten-coral.vercel.app',
    siteName: '조선힙합소리꾼',
    images: [
      {
        url: 'https://lms-platform-ten-coral.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: '조선힙합소리꾼',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '조선힙합소리꾼 공식 홈페이지 & 무료 나눔 허브',
    description:
      '가슴을 울리는 조선힙합소리꾼 명곡 연속듣기 · AI 영상제작 비법 · 유용한 자동화 프로그램 100% 무료 나눔터',
    images: ['https://lms-platform-ten-coral.vercel.app/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta property="og:title" content="조선힙합소리꾼 공식 홈페이지 & 무료 나눔 허브" />
        <meta property="og:description" content="가슴을 울리는 조선힙합소리꾼 명곡 연속듣기 · AI 영상제작 비법 · 유용한 자동화 프로그램 100% 무료 나눔터" />
        <meta property="og:image" content="https://lms-platform-ten-coral.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://lms-platform-ten-coral.vercel.app/og-image.png" />
      </head>
      <body>
        {/* 최상단 전면 무료 선언 띠배너 */}
        <div
          style={{
            background: 'linear-gradient(90deg, #ff0033 0%, #d4af37 50%, #ff0033 100%)',
            color: '#fff',
            textAlign: 'center',
            padding: '10px 16px',
            fontWeight: 900,
            fontSize: '1.05rem',
            letterSpacing: '-0.3px',
            textShadow: '0 1px 3px rgba(0,0,0,0.6)',
          }}
        >
          🎉 [전면 무료 개방 선언] 모든 AI 마스터 강의 · 영상제작 비법 · 각종 유용한 프로그램을 100% 무료(₩0)로 제공합니다!
        </div>

        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 5%',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            position: 'sticky',
            top: 0,
            background: 'rgba(10, 10, 12, 0.94)',
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <a
            href="/"
            style={{
              fontSize: '1.6rem',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span className="text-gradient">👑 조선힙합소리꾼</span>
            <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>
              × AI 무료 나눔센터
            </span>
          </a>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a
              href="/#sorikkun-channel"
              style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff1b8' }}
            >
              🎧 조선힙합소리꾼 곡 선택
            </a>
            <a
              href="/#free-programs"
              style={{ fontSize: '1.05rem', fontWeight: 700 }}
            >
              🛠️ 무료 프로그램·자료실
            </a>
            <a
              href="/#courses"
              style={{ fontSize: '1.05rem', fontWeight: 700 }}
            >
              🎬 전과정 무료강의
            </a>
            <a
              href="https://www.youtube.com/@%EC%A1%B0%EC%84%A0%ED%9E%99%ED%95%A9%EC%86%8C%EB%A6%AC%EA%BE%BC"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 18px',
                borderRadius: '999px',
                background: '#ff0033',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.98rem',
                boxShadow: '0 4px 14px rgba(255,0,51,0.4)',
              }}
            >
              📺 유튜브 채널 바로가기 ↗
            </a>
          </div>
        </nav>

        <main style={{ minHeight: 'calc(100vh - 90px)' }}>{children}</main>

        <footer
          style={{
            padding: '56px 5%',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            background: '#08080a',
          }}
        >
          <p style={{ fontWeight: 800, color: '#d4af37', fontSize: '1.15rem', marginBottom: '8px' }}>
            👑 조선힙합소리꾼 (Joseon Hip-Hop Sorikkun) × AI 마스터 무료 나눔 플랫폼
          </p>
          <p>
            앞으로도 영상 제작 비법, AI 음악 창작 노하우, 각종 유용한 자동화 프로그램을 만들어 100% 무료로 배포합니다.
          </p>
          <p style={{ marginTop: '12px', fontSize: '0.9rem', opacity: 0.7 }}>
            © 2026 조선힙합소리꾼 & AI Master Class. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
