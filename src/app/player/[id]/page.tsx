import Link from 'next/link';

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  // In a real app, verify the user has purchased this course before rendering
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 90px)' }}>
      {/* Video Area */}
      <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '24px' }}>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', color: '#fff', textDecoration: 'underline', fontSize: '1.125rem' }}>
            ← 강의실로 돌아가기
          </Link>
        </div>
        
        {/* Video Player */}
        {resolvedParams.id === 'course-ai-101' ? (
          <video 
            src="/videos/lecture1.mp4" 
            controls 
            autoPlay 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 'var(--text-2xl)', marginBottom: '16px' }}>▶️</div>
            <p style={{ fontSize: 'var(--text-lg)' }}>캡컷으로 완성된 프리미엄 강의 영상이 이곳에 재생됩니다.</p>
          </div>
        )}
      </div>

      {/* Course Info Area */}
      <div style={{ padding: '40px 5%', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '16px' }}>
          [1강] 오리엔테이션 및 AI의 기초
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '800px' }}>
          이번 강의에서는 시니어 여러분이 왜 AI를 당장 시작해야 하는지, 
          그리고 가장 쉽게 접근할 수 있는 첫 단추를 채우는 방법에 대해 알아봅니다.
        </p>
      </div>
    </div>
  );
}
