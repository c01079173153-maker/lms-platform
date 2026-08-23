import Link from 'next/link';

export default async function PlayerPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const lecture = resolvedSearchParams.lecture || '1';
  
  const videoSrc = lecture === '2' ? "/videos/lecture2.mp4" : "/videos/lecture1.mp4";
  const lectureTitle = lecture === '2' 
    ? "[2강] 챗GPT 실전 활용 - 긴 글 요약의 달인 되기" 
    : lecture === '3' ? "특별강의: GPT 이미지 생성 완전 마스터" : "[1강] 챗GPT 가입부터 기본 대화법 마스터하기";
  const lectureDesc = lecture === '2'
    ? "아무리 길고 복잡한 뉴스 기사나 건강 칼럼도 챗GPT를 활용해 단 3줄로 완벽하게 요약하는 비법을 알아봅니다."
    : lecture === '3' ? "텍스트로 이미지를 생성하는 기본 원리부터 5대 화풍(지브리, 픽사, 사이버펑크 등) 프롬프트 팁까지 완벽하게 알아봅니다." : "시니어 여러분이 왜 AI를 당장 시작해야 하는지, 그리고 가장 쉽게 접근할 수 있는 첫 단추를 채우는 방법에 대해 알아봅니다.";

  return (
    <div className="player-layout">
      {/* Left: Video Area */}
      <div className="player-video" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '24px', zIndex: 10 }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', color: '#fff', textDecoration: 'underline', fontSize: '1.125rem', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '4px' }}>
              ← 강의실로 돌아가기
            </Link>
          </div>
          
          {/* Video Player */}
          {resolvedParams.id === 'course-ai-101' ? (
            lecture === '3' ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <div style={{ 
                  aspectRatio: '16/9', 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  width: '100%', 
                  containerType: 'inline-size',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <iframe 
                    key="special-lecture"
                    src="/특별강의_GPT이미지생성.html" 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '1280px', 
                      height: '720px',
                      transform: 'scale(calc(100cqw / 1280))',
                      transformOrigin: 'top left',
                      border: 'none' 
                    }}
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <video 
                key={videoSrc}
                src={videoSrc} 
                controls 
                autoPlay 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              >
                Your browser does not support the video tag.
              </video>
            )
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
            {lectureTitle}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '800px' }}>
            {lectureDesc}
          </p>
        </div>
      </div>

      {/* Right: Playlist Sidebar */}
      <div className="player-sidebar" style={{ backgroundColor: '#1a1a1a', borderLeft: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>📚 강의 목차</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link href={`/player/${resolvedParams.id}?lecture=1`} style={{ padding: '20px 24px', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: lecture === '1' ? 'rgba(212, 175, 55, 0.1)' : 'transparent', textDecoration: 'none' }}>
            <div style={{ fontSize: '0.9rem', color: lecture === '1' ? '#d4af37' : 'var(--text-secondary)', marginBottom: '8px' }}>제 1강 (2:30)</div>
            <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: lecture === '1' ? 'bold' : 'normal' }}>챗GPT 가입부터 기본 대화법 마스터하기</div>
          </Link>
          <Link href={`/player/${resolvedParams.id}?lecture=2`} style={{ padding: '20px 24px', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: lecture === '2' ? 'rgba(212, 175, 55, 0.1)' : 'transparent', textDecoration: 'none' }}>
            <div style={{ fontSize: '0.9rem', color: lecture === '2' ? '#d4af37' : 'var(--text-secondary)', marginBottom: '8px' }}>제 2강 (7:10)</div>
            <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: lecture === '2' ? 'bold' : 'normal' }}>챗GPT 실전 활용 - 긴 글 요약의 달인 되기</div>
          </Link>
          <Link href={`/player/${resolvedParams.id}?lecture=3`} style={{ padding: '20px 24px', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: lecture === '3' ? 'rgba(212, 175, 55, 0.1)' : 'transparent', textDecoration: 'none' }}>
            <div style={{ fontSize: '0.9rem', color: lecture === '3' ? '#d4af37' : 'var(--text-secondary)', marginBottom: '8px' }}>특별강의 (8:01)</div>
            <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: lecture === '3' ? 'bold' : 'normal' }}>GPT 이미지 생성 완전 마스터</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
