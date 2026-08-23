import Link from 'next/link';

export default function SecretPromptsPage() {
  const prompts = [
    { id: '01', title: '교육분야 챗GPT 실전 프롬프트 10선', file: '01_교육_프롬프트_무료배포.txt', emoji: '🎓' },
    { id: '02', title: '어르신 생활도우미 프롬프트 10선', file: '02_어르신_생활도우미_프롬프트_무료배포.txt', emoji: '👴' },
    { id: '03', title: '직장인 업무자동화 100% 프롬프트', file: '03_직장인_업무자동화_프롬프트_무료배포.txt', emoji: '💼' },
    { id: '04', title: '코딩/프로그래밍 치트키 10선', file: '04_코딩_프로그래밍_프롬프트_무료배포.txt', emoji: '💻' },
    { id: '05', title: '마케팅/광고 카피라이팅 프롬프트', file: '05_마케팅_광고_프롬프트_무료배포.txt', emoji: '📈' },
    { id: '06', title: '건강/의료정보 탐색 최적화 프롬프트', file: '06_건강_의료정보_프롬프트_무료배포.txt', emoji: '🏥' },
    { id: '07', title: '재테크/금융 분석 프롬프트 10선', file: '07_재테크_금융_프롬프트_무료배포.txt', emoji: '💰' },
    { id: '08', title: '창작/글쓰기 마스터 프롬프트', file: '08_창작_글쓰기_프롬프트_무료배포.txt', emoji: '🎨' },
    { id: '09', title: '요리/생활정보 완벽 활용 프롬프트', file: '09_요리_생활정보_프롬프트_무료배포.txt', emoji: '🍳' },
    { id: '10', title: '여행/외국어 실시간 통번역 프롬프트', file: '10_여행_외국어_프롬프트_무료배포.txt', emoji: '🌍' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f11', color: '#fff', padding: '60px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚨</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ff6b6b', marginBottom: '16px' }}>
            [1급 기밀] 분야별 시크릿 프롬프트 10선
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#a0a0a0', lineHeight: '1.6' }}>
            상위 1% 블로거와 실무자들만 몰래 쓰는 치트키 프롬프트입니다.<br/>
            <strong>※ 본 자료는 한시적으로 무료 공개되며, 절대 외부에 무단 배포하지 마십시오.</strong>
          </p>
        </div>

        {/* Prompt List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {prompts.map((p) => (
            <div key={p.id} style={{ 
              background: 'linear-gradient(145deg, #1a1a1e 0%, #121215 100%)', 
              border: '1px solid #333', 
              borderRadius: '16px', 
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ fontSize: '2.5rem', background: '#25252b', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                  {p.emoji}
                </div>
                <div>
                  <div style={{ color: '#ff6b6b', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>FILE #{p.id}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, lineHeight: 1.4 }}>{p.title}</h3>
                </div>
              </div>
              
              <a 
                href={`/downloads/prompts/${p.file}`} 
                download={p.file}
                style={{
                  marginTop: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  background: 'linear-gradient(90deg, #ff3333 0%, #cc0000 100%)',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  transition: 'all 0.2s ease'
                }}
              >
                📥 [TXT] 프롬프트 원본 다운로드
              </a>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link href="/" style={{
            color: '#a0a0a0',
            textDecoration: 'none',
            fontSize: '1.1rem',
            borderBottom: '1px solid #a0a0a0',
            paddingBottom: '4px'
          }}>
            ← 메인 홈으로 돌아가기
          </Link>
        </div>

      </div>
    </div>
  );
}
