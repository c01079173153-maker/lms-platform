import Link from 'next/link';
import styles from './page.module.css';
import HeroVideoClient from './HeroVideoClient';
import BgmPlayerClient from './BgmPlayerClient';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <BgmPlayerClient />
      
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              AI 시대, <br />
              <span className="text-gradient">배우지 않으면 도태됩니다.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              시니어 맞춤형 AI 활용 마스터 클래스.<br/>
              어려운 용어는 쏙 빼고, 내 삶과 비즈니스에 당장 돈이 되는 AI 활용법을 1:1 과외처럼 알려드립니다.
            </p>
            <div className={styles.ctaContainer}>
              <Link href="#courses" className={styles.ctaButton}>
                수강 신청하기 (과정 둘러보기)
              </Link>
            </div>
          </div>
          <HeroVideoClient />
        </div>
      </section>

      {/* 2. Pain Points Section (문제 제기) */}
      <section className={styles.sectionBlock} style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <h2 className={styles.sectionTitle}>혹시 지금 이런 고민 하고 계신가요?</h2>
        <p className={styles.sectionSubtitle}>남들은 AI로 퇴근하는데, 나만 뒤처지는 기분이 든다면...</p>
        
        <div className={styles.painPointGrid}>
          <div className={styles.painPointCard}>
            <div className={styles.painPointIcon}>🕒</div>
            <div className={styles.painPointText}>직원에게 맡기면 하루 종일 걸리는 기획서, 답답해서 직접 쓰시나요?</div>
          </div>
          <div className={styles.painPointCard}>
            <div className={styles.painPointIcon}>📰</div>
            <div className={styles.painPointText}>뉴스에서 맨날 '챗GPT' 떠드는데, 정작 어떻게 가입하는지도 모르시나요?</div>
          </div>
          <div className={styles.painPointCard}>
            <div className={styles.painPointIcon}>📉</div>
            <div className={styles.painPointText}>젊은 직원들과 대화할 때 최신 트렌드를 몰라 소외감을 느끼시나요?</div>
          </div>
        </div>
      </section>

      {/* 3. Sneak Peek / Taste (맛보기) */}
      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>단 <span className="text-gradient">3분</span>이면 충분합니다.</h2>
        <p className={styles.sectionSubtitle}>실제 강의에서 배우게 될 놀라운 변화를 미리 맛보세요.</p>
        
        <div className={styles.sneakPeekContainer}>
          <div className={styles.sneakPeekText}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '16px' }}>
              비서가 필요 없는 'AI 업무 자동화'
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.6 }}>
              "새로운 브랜드 마케팅 기획서 써줘" 한 마디면, 챗GPT가 목차부터 세부 내용까지 3분 만에 완벽하게 작성해 줍니다. 타이핑 칠 줄만 안다면 누구나 할 수 있습니다.
            </p>
            <ul className={styles.sneakPeekList}>
              <li>시장 조사 및 데이터 분석 10초 컷</li>
              <li>고급스러운 이메일 문구 자동 완성</li>
              <li>외국어 자료 완벽 번역 및 요약</li>
            </ul>
          </div>
          <img src="/course-ai.png" alt="AI 기획서 작성 예시" className={styles.sneakPeekImage} />
        </div>
      </section>

      {/* 4. Instructor Section */}
      <section className={styles.sectionBlock} style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className={styles.instructorGrid}>
          <img src="/hero-bg.png" alt="대표 강사" className={styles.instructorImage} />
          <div>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>
              왜 <span className="text-gradient">시니어 전용</span> 강의인가요?
            </h2>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '24px' }}>
              기존의 AI 강의는 너무 빠르고, 어려운 영어 용어(프롬프트, 파라미터 등)를 남발하여 따라가기 벅찹니다. 
              <br/><br/>
              저희는 5060 시니어 리더분들의 눈높이에 맞추어, <strong>화면의 큼직한 버튼 누르는 법부터, 일상 언어로 챗GPT와 대화하는 법</strong>까지 아주 천천히, 그리고 확실하게 알려드립니다.
            </p>
            <div style={{ padding: '24px', background: 'rgba(212, 175, 55, 0.1)', borderLeft: '4px solid #d4af37', borderRadius: '4px' }}>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '1.2rem' }}>대표 강사 염상민 (당신의 친절한 AI 놀이반장)</strong>
              - "나이 50 넘어 AI의 재미에 푹 빠진 평범한 동네 아저씨"<br/>
              - 얼굴 없는 유튜브 '복순할매' 채널, AI 국악 '새벽의 가야금' 등 다수의 콘텐츠 직접 제작<br/>
              - 어려운 컴퓨터 용어 1도 없이, 옆집 형님처럼 재밌고 찰지게 알려드리는 실전형 강사<br/>
              - "우리 동년배들도 클릭 몇 번으로 마법을 부릴 수 있다는 것을 증명하고 있습니다!"
            </div>
          </div>
        </div>
      </section>

      {/* 5. Reviews */}
      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>이미 수많은 동년배 리더들이 증명했습니다.</h2>
        <p className={styles.sectionSubtitle}>수강생 만족도 98.7%의 리얼 후기</p>
        
        <div className={styles.reviewGrid}>
          <div className={styles.reviewCard}>
            <div className={styles.stars}>★★★★★</div>
            <p style={{ fontSize: '1.125rem', marginBottom: '16px', lineHeight: 1.5, fontStyle: 'italic' }}>
              "직원들에게 매번 물어보기 민망했는데, 이제는 제가 먼저 AI로 기획서를 뽑아서 지시합니다. 자신감이 생겼어요."
            </p>
            <strong style={{ color: 'var(--text-secondary)' }}>- 중소기업 대표 김*환 님 (62세)</strong>
          </div>
          <div className={styles.reviewCard}>
            <div className={styles.stars}>★★★★★</div>
            <p style={{ fontSize: '1.125rem', marginBottom: '16px', lineHeight: 1.5, fontStyle: 'italic' }}>
              "유튜브 영상 만드는 게 평생 꿈이었는데, 얼굴 안 나오고도 멋진 영상을 만들어서 어제 수익 창출 승인받았습니다!"
            </p>
            <strong style={{ color: 'var(--text-secondary)' }}>- 은퇴 후 유튜버 박*석 님 (65세)</strong>
          </div>
          <div className={styles.reviewCard}>
            <div className={styles.stars}>★★★★★</div>
            <p style={{ fontSize: '1.125rem', marginBottom: '16px', lineHeight: 1.5, fontStyle: 'italic' }}>
              "화면 글씨도 크고 설명이 너무 친절해서 포기하지 않고 끝까지 들을 수 있었습니다. 강력 추천합니다."
            </p>
            <strong style={{ color: 'var(--text-secondary)' }}>- 요식업 프랜차이즈 이*숙 님 (58세)</strong>
          </div>
        </div>
      </section>

      {/* 5.5 Free Resources (Lead Magnet) */}
      <section className={styles.sectionBlock}>
        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(22, 22, 26, 0.9) 100%)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <h2 className={styles.sectionTitle} style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>
            🎁 사장님을 위한 100% 무료 시크릿 자료실
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
            결제하기 전, 사령관님의 압도적인 AI 실력을 먼저 무료로 맛보세요!
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* Resource 1: ChatGPT */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '2.5rem' }}>📕</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>[PDF] 나만 모르는 챗GPT 실전 프롬프트 50선</h4>
              <a href="/downloads/chatgpt_50.html" download="챗GPT_프롬프트_50선.html" className={styles.courseButton} style={{ marginTop: 'auto', background: 'var(--accent-primary)', color: '#000', border: 'none', display: 'block' }}>
                📥 무료로 다운받기
              </a>
            </div>

            {/* Resource 2: Claude */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '2.5rem' }}>📘</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>[PDF] 긴 글 요약의 달인, 클로드(Claude) 활용 백서</h4>
              <a href="/downloads/claude_guide.html" download="클로드_활용_백서.html" className={styles.courseButton} style={{ marginTop: 'auto', background: 'var(--accent-primary)', color: '#000', border: 'none', display: 'block' }}>
                📥 무료로 다운받기
              </a>
            </div>

            {/* Resource 3: Gemini */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '2.5rem' }}>📙</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>[PDF] 구글과 찰떡궁합, 제미나이(Gemini) 실무 템플릿</h4>
              <a href="/downloads/gemini_template.html" download="제미나이_실무_템플릿.html" className={styles.courseButton} style={{ marginTop: 'auto', background: 'var(--accent-primary)', color: '#000', border: 'none', display: 'block' }}>
                📥 무료로 다운받기
              </a>
            </div>

            {/* Resource 4: YouTube Starter */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '2.5rem' }}>📺</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>[영상 가이드] 컴맹도 5분 만에 끝내는 유튜브 채널 개설법</h4>
              <a href="/downloads/youtube_guide.html" download="유튜브_채널_개설법.html" className={styles.courseButton} style={{ marginTop: 'auto', display: 'block' }}>
                ▶ 지금 바로 시청하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Course List (CTA) */}
      <section id="courses" className={styles.courseSection}>
        <h2 className={styles.sectionTitle}>이제, 사장님이 직접 경험해 보실 차례입니다.</h2>
        
        <div className={styles.courseGrid}>
          {/* Course 1 */}
          <div className={`glass-panel ${styles.courseCard} hover-lift`}>
            <img src="/course-ai.png" alt="챗GPT, 제미나이 완벽 활용법" className={styles.courseImage} />
            <div className={styles.courseContent}>
              <span className={styles.courseBadge}>BEST SELLER</span>
              <h3 className={styles.courseTitle}>시니어 AI 101<br/><span style={{fontSize:'0.85em', color:'var(--accent-primary)'}}>챗GPT, 제미나이 활용법</span></h3>
              <p className={styles.courseDesc}>
                세상에서 가장 똑똑한 2대 AI를 내 비서처럼 부리는 방법! 일상 대화부터 번역, 문서 요약, 아이디어 기획까지 가장 쉽고 완벽하게 알려드립니다.
              </p>
              <div className={styles.coursePrice}>₩ 199,000</div>
              <Link href="/checkout/course-ai-101" className={styles.courseButton}>
                상세 커리큘럼 보기 & 결제하기
              </Link>
            </div>
          </div>

          {/* Course 2 */}
          <div className={`glass-panel ${styles.courseCard} hover-lift`}>
            <img src="/boksoon_thumb.png" alt="AI 영상 제작" className={styles.courseImage} />
            <div className={styles.courseContent}>
              <span className={styles.courseBadge}>NEW</span>
              <h3 className={styles.courseTitle}>AI 영상 제작<br/><span style={{fontSize:'0.85em', color:'var(--text-secondary)'}}>(복순할매 실습)</span></h3>
              <p className={styles.courseDesc}>
                얼굴 노출 없이, 목소리 녹음 없이! AI를 활용해 고퀄리티 영상 제작과 유튜브 수익화 비법을 알려드립니다.
              </p>
              
              <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: 600 }}>▶ 수강생 실습 샘플: 복순할매 채널</p>
                <video controls src="/boksoon_video.mp4" style={{ width: '100%', borderRadius: '4px' }}></video>
              </div>

              <div className={styles.coursePrice}>₩ 249,000</div>
              <Link href="/checkout/course-youtube-master" className={styles.courseButton}>
                상세 커리큘럼 보기 & 결제하기
              </Link>
            </div>
          </div>
          {/* Course 3 */}
          <div className={`glass-panel ${styles.courseCard} hover-lift`}>
            <img src="/course_ai_music.png" alt="AI 작곡 및 프롬프트 마스터" className={styles.courseImage} />
            <div className={styles.courseContent}>
              <span className={styles.courseBadge} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>PREMIUM</span>
              <h3 className={styles.courseTitle}>AI 작사/작곡 &<br/><span style={{fontSize:'0.85em', color:'var(--text-secondary)'}}>완벽 프롬프트 엔지니어링</span></h3>
              <p className={styles.courseDesc}>
                내가 원하는 대로 척척 알아듣게 만드는 기적의 프롬프트 작성법부터, 나만의 감성이 담긴 음원과 노래를 1분 만에 작곡하는 마법 같은 경험을 제공합니다.
              </p>
              
              <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: 600 }}>🎵 수강생 실습 샘플: 새벽의 가야금</p>
                <audio controls src="/gayageum.mp3" style={{ width: '100%', height: '32px' }}></audio>
              </div>

              <div className={styles.coursePrice}>₩ 299,000</div>
              <Link href="/checkout/course-ai-music" className={styles.courseButton}>
                상세 커리큘럼 보기 & 결제하기
              </Link>
            </div>
          </div>

          {/* Course 4: Vibe Coding */}
          <div className={`glass-panel ${styles.courseCard} hover-lift`}>
            <img src="/hero-bg.png" alt="바이브 코딩 마스터" className={styles.courseImage} />
            <div className={styles.courseContent}>
              <span className={styles.courseBadge} style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', border: '1px solid #d4af37' }}>VVIP EXCLUSIVE</span>
              <h3 className={styles.courseTitle}>[고급과정] 클로드 & 커서<br/><span style={{fontSize:'0.85em', color:'var(--text-secondary)'}}>바이브 코딩 마스터</span></h3>
              <p className={styles.courseDesc}>
                코딩을 몰라도, 타이핑을 못해도 괜찮습니다! AI와 대화만으로 나만의 자동화 프로그램과 웹사이트를 뚝딱 만들어내는 기적의 코딩법.
              </p>
              
              <div style={{ marginTop: '16px', background: 'rgba(212, 175, 55, 0.05)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <p style={{ fontSize: '0.9rem', color: '#d4af37', marginBottom: '4px', fontWeight: 700 }}>💡 프리미엄 혜택</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>1:1 원격 설치 지원 및 평생 평생 업데이트 제공</p>
              </div>

              <div className={styles.coursePrice}>₩ 399,000</div>
              <Link href="/checkout/course-vibe-coding" className={styles.courseButton} style={{ background: 'linear-gradient(90deg, #d4af37 0%, #b58d19 100%)', color: '#000' }}>
                상세 커리큘럼 보기 & 결제하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
