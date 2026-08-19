import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '프리미엄 시니어 AI 마스터 클래스',
  description: 'AI 시대를 앞서가는 시니어 리더들을 위한 최고급 온라인 교육 플랫폼입니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 5%',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'sticky',
          top: 0,
          background: 'rgba(10, 10, 12, 0.9)',
          backdropFilter: 'blur(10px)',
          zIndex: 100
        }}>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, letterSpacing: '-0.5px' }} className="text-gradient">
            AI MASTER <span style={{ color: 'var(--text-primary)' }}>CLASS</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="/" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, transition: 'color 0.2s' }}>홈</a>
            <a href="/courses" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, transition: 'color 0.2s' }}>내 강의실</a>
          </div>
        </nav>
        
        <main style={{ minHeight: 'calc(100vh - 90px)' }}>
          {children}
        </main>
        
        <footer style={{
          padding: '48px 5%',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '1rem'
        }}>
          <p>© 2026 AI Master Class. All rights reserved.</p>
          <p style={{ marginTop: '8px' }}>프리미엄 시니어를 위한 완벽한 교육 플랫폼</p>
        </footer>
      </body>
    </html>
  );
}
