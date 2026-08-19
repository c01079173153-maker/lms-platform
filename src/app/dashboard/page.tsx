import Link from 'next/link';

export default function Dashboard({ searchParams }: { searchParams: { success?: string } }) {
  const isSuccess = searchParams.success === 'true';

  return (
    <div className="animate-fade-in" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {isSuccess && (
        <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', border: '1px solid var(--accent-success)', borderRadius: 'var(--radius-md)', marginBottom: '40px', fontSize: '1.125rem', fontWeight: 600 }}>
          결제가 성공적으로 완료되었습니다! 이제 강의를 바로 수강하실 수 있습니다. 🎉
        </div>
      )}

      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '48px' }}>
        내 강의실
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
        {/* Purchased Course Card */}
        <div className="glass-panel hover-lift" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', borderRadius: '20px', fontWeight: 600, alignSelf: 'flex-start' }}>수강 중</div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, lineHeight: 1.4 }}>
            시니어 비즈니스 AI 101 - 업무 자동화의 비밀
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>진도율: 0%</p>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '0%', height: '100%', background: 'var(--accent-success)' }}></div>
          </div>
          
          <Link href="/player/course-ai-101" style={{ marginTop: 'auto', display: 'block', textAlign: 'center', background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 'var(--text-md)' }}>
            강의 학습하기
          </Link>
        </div>
      </div>
    </div>
  );
}
