import Link from 'next/link';
import styles from './page.module.css';
import BgmPlayerClient from './BgmPlayerClient';
import JoseonHipHopShowcase from './JoseonHipHopShowcase';
import programsData from '../data/programs.json';

interface ProgramItem {
  id: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  icon: string;
  title: string;
  desc: string;
  href: string;
  downloadName?: string;
  buttonText: string;
  isDownload: boolean;
}

const PROGRAMS: ProgramItem[] = programsData as ProgramItem[];

export default function Home() {
  return (
    <div className="animate-fade-in">
      <BgmPlayerClient />

      {/* 1. Eye-Catching Hero Section */}
      <section
        className={styles.hero}
        style={{
          padding: '80px 5% 90px',
          background:
            'radial-gradient(circle at 80% 20%, rgba(255, 0, 51, 0.18) 0%, rgba(212, 175, 55, 0.15) 35%, rgba(10, 10, 12, 0.96) 80%), url("/hero-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                alignSelf: 'flex-start',
                background: 'rgba(255, 0, 51, 0.2)',
                border: '2px solid #ff3355',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '999px',
                fontWeight: 900,
                fontSize: '1rem',
                boxShadow: '0 0 25px rgba(255, 0, 51, 0.35)',
              }}
            >
              🔥 수익화 100% 전면 무료 전환! · 조건 없는 무료 나눔 플랫폼
            </div>

            <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)', lineHeight: 1.2 }}>
              가슴을 울리는 <span className="text-gradient">‘조선힙합소리꾼’</span>
              <br />
              &amp; AI 영상·유용한 프로그램{' '}
              <span style={{ color: '#10b981', textDecoration: 'underline' }}>100% 무료 나눔터</span>
            </h1>

            <p className={styles.heroSubtitle} style={{ color: '#e4e4e7', fontSize: '1.25rem', lineHeight: 1.7 }}>
              지친 삶을 위로하고 속 시원한 사이다를 날리는 <strong>[조선힙합소리꾼]</strong>의 공식 홈입니다!
              <br />
              원하시는 명곡을 골라 바로 감상하시고, <strong>AI 영상 제작 비법과 실전 자동화 프로그램·전 과정 강의</strong>까지 결제 없이 <strong>전부 무료(₩0)</strong>로 가져가세요!
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                marginTop: '12px',
              }}
            >
              <a
                href="#sorikkun-channel"
                className={styles.ctaButton}
                style={{
                  background: 'linear-gradient(135deg, #ff0033 0%, #cc0000 100%)',
                  color: '#fff',
                  padding: '20px 36px',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  boxShadow: '0 12px 30px rgba(255, 0, 51, 0.45)',
                }}
              >
                🎧 조선힙합소리꾼 노래 골라 듣기
              </a>

              <a
                href="#free-programs"
                className={styles.ctaButton}
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)',
                  color: '#000',
                  padding: '20px 36px',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                }}
              >
                🛠️ 무료 프로그램 &amp; 영상제작 자료실
              </a>
            </div>

            {/* 핵심 3대 약속 뱃지 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginTop: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(212,175,55,0.35)',
                  fontWeight: 800,
                }}
              >
                👑 조선힙합소리꾼 공식 채널 직결
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16,185,129,0.4)',
                  fontWeight: 800,
                  color: '#6ee7b7',
                }}
              >
                💸 전 강의·자료 ₩0 전면 무료
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(56,189,248,0.4)',
                  fontWeight: 800,
                  color: '#7dd3fc',
                }}
              >
                🚀 영상제작·유용한 프로그램 지속 무료배포
              </div>
            </div>
          </div>

          {/* 우측: 조선힙합소리꾼 공식 대표 비주얼 아트 */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(212, 175, 55, 0.25)',
              border: '2px solid rgba(212, 175, 55, 0.5)',
            }}
          >
            <img
              src="/sorikkun/joseon-hiphop-banner.jpg"
              alt="조선힙합소리꾼 (판소리 x 힙합 x 코미디)"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. 조선힙합소리꾼 공식 채널 소개 & 곡 선택 쇼케이스 */}
      <JoseonHipHopShowcase />

      {/* 3. 앞으로 영상제작 및 각종 유용한 프로그램 무료 제공 선언 & 자료실 */}
      <section id="free-programs" className={styles.sectionBlock}>
        <div
          className="glass-panel"
          style={{
            padding: '64px 40px',
            textAlign: 'center',
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(212, 175, 55, 0.08) 50%, rgba(22, 22, 26, 0.95) 100%)',
            border: '2px solid #d4af37',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: '999px',
              background: '#10b981',
              color: '#000',
              fontWeight: 900,
              fontSize: '1rem',
              marginBottom: '16px',
            }}
          >
            🎁 평생 100% 무료 나눔 약속
          </div>

          <h2
            className={styles.sectionTitle}
            style={{ color: '#fff', marginBottom: '16px', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            앞으로 <span className="text-gradient">영상제작 비법 &amp; 각종 유용한 프로그램</span>을
            <br />
            직접 만들어 <span style={{ color: '#10b981' }}>100% 무료로 제공</span>해 드립니다!
          </h2>

          <p
            style={{
              fontSize: '1.25rem',
              color: '#d4d4d8',
              maxWidth: '850px',
              margin: '0 auto 44px',
              lineHeight: 1.7,
            }}
          >
            비싼 돈 내고 배우거나 유료 프로그램을 결제하실 필요 없습니다.
            <br />
            <strong>‘조선힙합소리꾼’</strong> 채널을 운영하며 직접 개발한 <strong>AI 뮤직비디오·쇼츠 제작 도구, 웹 화면 녹화기, 실전 프롬프트 백서, 업무 자동화 프로그램</strong>을 이곳에서 누구나 조건 없이 무료로 사용하세요!
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '1120px',
              margin: '0 auto',
            }}
          >
            {PROGRAMS.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  padding: '32px',
                  borderRadius: '18px',
                  border: `2px solid ${item.badgeBg}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <span
                  style={{
                    alignSelf: 'center',
                    background: item.badgeBg,
                    color: item.badgeColor,
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                  }}
                >
                  {item.badge}
                </span>
                <div style={{ fontSize: '2.6rem' }}>{item.icon}</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  {item.title}
                </h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.96rem', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
                {item.isDownload ? (
                  <a
                    href={item.href}
                    download={item.downloadName || true}
                    className={styles.courseButton}
                    style={{
                      marginTop: 'auto',
                      background: item.badgeBg,
                      color: item.badgeColor,
                      border: 'none',
                      display: 'block',
                      fontWeight: 900,
                    }}
                  >
                    {item.buttonText}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={styles.courseButton}
                    style={{
                      marginTop: 'auto',
                      background: item.badgeBg,
                      color: item.badgeColor,
                      border: 'none',
                      display: 'block',
                      fontWeight: 900,
                    }}
                  >
                    {item.buttonText}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 전 과정 100% 무료 강의실 (기존 유료 -> 전면 무료 개방) */}
      <section id="courses" className={styles.courseSection} style={{ padding: '60px 5% 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: '999px',
              background: 'rgba(255, 0, 51, 0.15)',
              border: '1px solid #ff3355',
              color: '#ff6b81',
              fontWeight: 900,
              marginBottom: '16px',
            }}
          >
            🔥 기존 총액 114만 원 상당 유료 강의 → 조건 없이 ₩0 전면 무료 개방!
          </span>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '12px' }}>
            원하시는 과정을 선택해 <span className="text-gradient">지금 바로 무료로 학습</span>하세요
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
            회원가입이나 카드 결제 없이 클릭 즉시 강의실과 커리큘럼을 열람하실 수 있습니다.
          </p>
        </div>

        <div className={styles.courseGrid}>
          {/* Course 1 */}
          <div className={`glass-panel ${styles.courseCard} hover-lift`} style={{ border: '1px solid rgba(16,185,129,0.4)' }}>
            <img src="/course_ai_music.png" alt="챗GPT, 제미나이 완벽 활용법" className={styles.courseImage} />
            <div className={styles.courseContent}>
              <span className={styles.courseBadge} style={{ background: '#10b981', color: '#000', fontWeight: 900 }}>
                100% 무료 개방
              </span>
              <h3 className={styles.courseTitle}>
                왕초보 AI 실전 101
                <br />
                <span style={{ fontSize: '0.85em', color: 'var(--accent-primary)' }}>
                  챗GPT · 제미나이 실전 기초 활용법
                </span>
              </h3>
              <p className={styles.courseDesc}>
                세상에서 가장 똑똑한 AI를 내 비서처럼 부리는 방법! 일상 대화부터 번역, 문서 요약, 아이디어 기획까지 가장 쉽게 알려드립니다.
              </p>
              <div className={styles.coursePrice}>
                <span style={{ textDecoration: 'line-through', color: '#71717a', fontSize: '1.1rem', marginRight: '10px' }}>
                  ₩ 199,000
                </span>
                <span style={{ color: '#10b981' }}>₩ 0 (전면 무료)</span>
              </div>
              <Link
                href="/player/course-ai-101"
                className={styles.courseButton}
                style={{ background: '#10b981', color: '#000', fontWeight: 900, border: 'none' }}
              >
                🎓 결제 없이 바로 강의실 입장하기
              </Link>
            </div>
          </div>

          {/* Course 2 */}
          <div className={`glass-panel ${styles.courseCard} hover-lift`} style={{ border: '1px solid rgba(16,185,129,0.4)' }}>
            <img src="/boksoon_thumb.png" alt="AI 영상 제작" className={styles.courseImage} />
            <div className={styles.courseContent}>
              <span className={styles.courseBadge} style={{ background: '#10b981', color: '#000', fontWeight: 900 }}>
                100% 무료 개방
              </span>
              <h3 className={styles.courseTitle}>
                AI 영상 &amp; 쇼츠 제작 마스터
                <br />
                <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                  (뮤직비디오 · 캐릭터 영상 실습)
                </span>
              </h3>
              <p className={styles.courseDesc}>
                얼굴 노출 없이, 카메라 없이! AI를 활용해 고퀄리티 캐릭터 영상과 유튜브 롱폼·쇼츠를 제작하는 실전 비법을 공개합니다.
              </p>

              <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: 700 }}>
                  ▶ 실전 AI 캐릭터 영상 샘플
                </p>
                <video controls src="/boksoon_video.mp4" style={{ width: '100%', borderRadius: '4px' }}></video>
              </div>

              <div className={styles.coursePrice}>
                <span style={{ textDecoration: 'line-through', color: '#71717a', fontSize: '1.1rem', marginRight: '10px' }}>
                  ₩ 249,000
                </span>
                <span style={{ color: '#10b981' }}>₩ 0 (전면 무료)</span>
              </div>
              <Link
                href="/checkout/course-youtube-master"
                className={styles.courseButton}
                style={{ background: '#10b981', color: '#000', fontWeight: 900, border: 'none' }}
              >
                🎓 무료 커리큘럼 &amp; 강의 보기
              </Link>
            </div>
          </div>

          {/* Course 3 */}
          <div className={`glass-panel ${styles.courseCard} hover-lift`} style={{ border: '2px solid #d4af37' }}>
            <img src="/sorikkun/thumb_nado.jpg" alt="조선힙합소리꾼 AI 작곡 마스터" className={styles.courseImage} />
            <div className={styles.courseContent}>
              <span className={styles.courseBadge} style={{ background: '#d4af37', color: '#000', fontWeight: 900 }}>
                👑 조선힙합소리꾼 시그니처
              </span>
              <h3 className={styles.courseTitle}>
                AI 작사/작곡 &amp; 음원 제작
                <br />
                <span style={{ fontSize: '0.85em', color: '#d4af37' }}>
                  (‘나도 사람이다’ 실전 제작기)
                </span>
              </h3>
              <p className={styles.courseDesc}>
                사람들의 마음을 울리는 가사 작법부터 국악·힙합·발라드 명곡을 탄생시키는 프롬프트 엔지니어링 비법을 아낌없이 나눕니다.
              </p>

              <div
                style={{ marginTop: '8px', background: 'rgba(212,175,55,0.1)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(212,175,55,0.3)' }}
              >
                <p style={{ fontSize: '0.9rem', color: '#fff1b8', marginBottom: '8px', fontWeight: 800 }}>
                  🎵 대표곡 샘플: 조선힙합소리꾼 - 나도 사람이다 (다운로드 보호됨)
                </p>
                <audio
                  controls
                  controlsList="nodownload noplaybackrate"
                  src="/sorikkun/nado_saramida.mp3"
                  style={{ width: '100%', height: '34px' }}
                ></audio>
              </div>

              <div className={styles.coursePrice}>
                <span style={{ textDecoration: 'line-through', color: '#71717a', fontSize: '1.1rem', marginRight: '10px' }}>
                  ₩ 299,000
                </span>
                <span style={{ color: '#10b981' }}>₩ 0 (전면 무료)</span>
              </div>
              <Link
                href="/checkout/course-ai-music"
                className={styles.courseButton}
                style={{ background: 'linear-gradient(90deg, #d4af37 0%, #b58d19 100%)', color: '#000', fontWeight: 900, border: 'none' }}
              >
                🎓 무료 커리큘럼 &amp; 강의 보기
              </Link>
            </div>
          </div>

          {/* Course 4: Vibe Coding */}
          <div className={`glass-panel ${styles.courseCard} hover-lift`} style={{ border: '1px solid rgba(16,185,129,0.4)' }}>
            <img src="/hero-bg.png" alt="바이브 코딩 마스터" className={styles.courseImage} />
            <div className={styles.courseContent}>
              <span className={styles.courseBadge} style={{ background: '#10b981', color: '#000', fontWeight: 900 }}>
                100% 무료 개방
              </span>
              <h3 className={styles.courseTitle}>
                AI 바이브 코딩 &amp; 자동화
                <br />
                <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                  나만의 프로그램 뚝딱 만들기
                </span>
              </h3>
              <p className={styles.courseDesc}>
                코딩을 몰라도 AI와 대화만으로 유튜브 자동 업로드, 영상 편집 보조, 웹사이트 등 유용한 프로그램을 직접 만드는 비법입니다.
              </p>

              <div style={{ marginTop: '8px', background: 'rgba(16, 185, 129, 0.08)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <p style={{ fontSize: '0.9rem', color: '#6ee7b7', marginBottom: '4px', fontWeight: 800 }}>
                  💡 실전 제작 프로그램 무료 배포
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  앞으로 제작되는 모든 자동화 툴과 유틸리티가 무료로 업데이트됩니다.
                </p>
              </div>

              <div className={styles.coursePrice}>
                <span style={{ textDecoration: 'line-through', color: '#71717a', fontSize: '1.1rem', marginRight: '10px' }}>
                  ₩ 399,000
                </span>
                <span style={{ color: '#10b981' }}>₩ 0 (전면 무료)</span>
              </div>
              <Link
                href="/checkout/course-vibe-coding"
                className={styles.courseButton}
                style={{ background: '#10b981', color: '#000', fontWeight: 900, border: 'none' }}
              >
                🎓 무료 커리큘럼 &amp; 강의 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 크리에이터 & 강사 소개 */}
      <section className={styles.sectionBlock} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', marginBottom: '80px' }}>
        <div className={styles.instructorGrid}>
          <img src="/sorikkun/joseon-hiphop-banner.jpg" alt="조선힙합소리꾼" className={styles.instructorImage} />
          <div>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>
              음악으로 위로하고, <span className="text-gradient">기술을 무료로 나누는</span>
              <br />
              크리에이터 조선힙합소리꾼
            </h2>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '24px', color: '#e4e4e7' }}>
              한국적인 감성과 힙합·발라드를 결합한 <strong>‘조선힙합소리꾼’</strong> 유튜브 채널을 통해 지친 현대인들에게 따뜻한 위로와 통쾌한 카타르시스를 전하고 있습니다.
              <br />
              <br />
              더 많은 분들이 AI를 통해 자신만의 음악과 영상을 만들고 편리한 도구를 누리실 수 있도록, <strong>모든 교육 과정과 직접 제작한 유용한 프로그램들을 100% 무료</strong>로 공개합니다.
            </p>
            <div style={{ padding: '24px', background: 'rgba(212, 175, 55, 0.1)', borderLeft: '4px solid #d4af37', borderRadius: '8px', marginBottom: '24px' }}>
              <strong style={{ display: 'block', marginBottom: '8px', fontSize: '1.25rem', color: '#fff1b8' }}>
                👑 조선힙합소리꾼 대표 작품 &amp; 활동
              </strong>
              • 유튜브 <strong>[조선힙합소리꾼]</strong> 공식 아티스트 &amp; 프로듀서
              <br />
              • 대표곡: 《나도 사람이다》, 《열심히 살았는데 남는 게 없더라》, 《인생 반품이요》, 《착하게 살면 호구가 되더라》, 《왜 나만 참아야 해》 외 다수
              <br />
              • AI 영상 제작 · 음원 프로듀싱 · 자동화 프로그램 개발 및 무료 배포
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <a
                href="https://www.youtube.com/@%EC%A1%B0%EC%84%A0%ED%9E%99%ED%95%A9%EC%86%8C%EB%A6%AC%EA%BE%BC"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  background: '#ff0033',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 24px rgba(255, 0, 51, 0.4)',
                }}
              >
                📺 조선힙합소리꾼 유튜브 채널 구독·구경하기 ↗
              </a>
              <a
                href="mailto:sorikkun.official@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 28px',
                  borderRadius: '12px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  color: '#fff1b8',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  textDecoration: 'none',
                }}
              >
                ✉️ 공식 문의 : sorikkun.official@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
